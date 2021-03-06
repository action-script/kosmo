fs = require('fs')

readFiles = (dirname, onFileContent, onError, onFinish) ->
   fs.readdir(dirname, (err, filenames) ->
      return onError(err) if (err)

      console.log('Files', filenames)
      file_number = filenames.length
      filenames.forEach((filename) ->
         fs.readFile(dirname + '/' + filename, 'utf-8', (err, content) ->
            return onError(err) if (err)
            onFileContent(filename, content)
            file_number--
            onFinish() if file_number == 0
         )
      )
   )


saveFile = (dirname, content, onSuccess, onError) ->
   fs.writeFile(dirname, content, { flag: 'w' }, (err) ->
      return onError(err) if err
      onSuccess()
   )


module.exports = (grunt) ->

   grunt.initConfig
      babel:
         options:
            sourceMap: false
            comments: false
            plugins: [
               "check-es2015-constants"
               "transform-es2015-block-scoped-functions"
               "transform-es2015-block-scoping"
               "transform-es2015-for-of"
               "transform-es2015-arrow-functions"
               "transform-es2015-classes"
               "transform-es2015-destructuring"
               "transform-es2015-literals"
               "transform-es2015-object-super"
               "transform-es2015-modules-commonjs"
               "transform-es2015-shorthand-properties"
               "transform-es2015-spread"
               "transform-es2015-template-literals"
               "transform-es2015-parameters"
               "transform-es2015-typeof-symbol"
#               "transform-regenerator"
            ]
         app:
            files: [
               expand: true
               cwd: 'app/assets'
               src: ['**/*.es6']
               dest: 'app/build'
               ext: '.js'
            ]
         client:
            files: [
               expand: true
               cwd: 'client/assets/javascript'
               src: ['**/*.es6']
               dest: 'client/build'
               ext: '.js'
            ]

      webpack:
         dev:
            entry: __dirname + "/client/build/main.js"
            output:
               path: "public/js/"
               filename: "main.js"
            pathinfo: true
            debug: true
            stats:
               colors: false
               modules: true
               reasons: true
            progress: false
            watch: false
            keepalive: false

      eslint:
         options:
            configFile: "eslint.json"
#            outputFile: "logs/eslint_report.log"
         app:
            files:
               src: [ "app/assets/**/*.es6" ]
         client:
            files:
               src: [ "client/assets/javascript/**/*.es6" ]

      watch:
         app_scripts:
            files: ['app/**/*.es6']
            tasks: ['build_app']
         client_scripts:
            files: ['client/assets/javascript/**/*.es6']
            tasks: ['build_client']
         shader_scripts:
            files: ['client/assets/shaders/**/*.shader']
            tasks: ['convert_shaders','copy:shaders_public','webpack:dev']

      copy:
         app_build:
            files: [
              {expand: true, cwd: 'app/build/', src: ['**'], dest: 'app_run/'}
              {expand: true, cwd: 'app/', src: ['views/**'], dest: 'app_run/'}
            ]
         client_public:
            files: [
              {expand: true, cwd: 'client/assets/stylesheets', src: ['**'], dest: 'public/style/'}
            ]
         shaders_public:
            file: [
              {expand: true, cwd: 'client/assets/shaders', src: ['**'], dest: 'public/shaders/'}
            ]

      clean:
         app_build: ["app/build", "app_run"]
         client_build: ["client/build", "public"]



   grunt.loadNpmTasks('grunt-babel')
   grunt.loadNpmTasks('grunt-eslint')
   grunt.loadNpmTasks('grunt-contrib-watch')
   grunt.loadNpmTasks('grunt-contrib-copy')
   grunt.loadNpmTasks('grunt-contrib-clean')
   grunt.loadNpmTasks('grunt-webpack')

   # Custom task
   grunt.registerTask('convert_shaders', '', () ->
      done = this.async()
      shaders = {}
      grunt.log.writeln('reading files')
      readFiles('./client/assets/shaders', (filename, content) ->
         shaders[filename.replace('.', '_')] = content
      , (err) ->
         throw err
      , () ->
         grunt.log.writeln('saving file', JSON.stringify(shaders))
         saveFile('./client/build/shaders.js', 'module.exports = ' + JSON.stringify(shaders)
         , () ->
            done()
         , (err) ->
            throw err
         )
      )
   )


   grunt.registerTask("default", ["eslint", "build_app", "build_client"])

   grunt.registerTask("build_app", [
      "clean:app_build"
      "babel:app"
      "copy:app_build"
   ])
   grunt.registerTask("build_client", [
      "clean:client_build"
      "babel:client"
      "convert_shaders"
      "copy:client_public"
      "copy:shaders_public"
      "webpack:dev"
   ])

