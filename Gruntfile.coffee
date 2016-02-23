module.exports = (grunt) ->

   grunt.initConfig
      babel:
         options:
            sourceMap: false
            comments: false
            plugins: [
               "transform-es2015-arrow-functions"
               "transform-es2015-classes"
               "transform-es2015-destructuring"
               "transform-es2015-literals"
               "transform-es2015-object-super"
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

      eslint:
         options:
            configFile: "eslint.json"
#            outputFile: "logs/eslint_report.log"
         app:
            files:
               src: [ "app/assets/**/*.es6" ]
         client:
            files:
               src: [ "public/assets/scripts/**/*.es6" ]

      watch:
         app_scripts:
            files: ['app/**/*.es6']
            tasks: ['clean:app_build', 'babel:app', 'copy:app_build']

      copy:
         app_build:
            files: [
              {expand: true, cwd: 'app/build/', src: ['**'], dest: 'app_run/'}
              {expand: true, cwd: 'app/', src: ['views/**'], dest: 'app_run/'}
            ]

      clean:
         app_build: ["app/build", "app_run"]



   grunt.loadNpmTasks('grunt-babel')
   grunt.loadNpmTasks('grunt-eslint')
   grunt.loadNpmTasks('grunt-contrib-watch')
   grunt.loadNpmTasks('grunt-contrib-copy')
   grunt.loadNpmTasks('grunt-contrib-clean')

   grunt.registerTask("default", ["eslint:app","clean:app_build","babel:app","copy:app_build"])

