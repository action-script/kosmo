module.exports = (grunt) ->

   grunt.initConfig
      babel:
         options:
            sourceMap: true
            comments: false
         all:
            files: [
               expand: true
               cwd: 'app/assets'
               src: ['**/*.es6']
               dest: 'app/build'
               ext: '.js'
            ]

      jslint:
         server:
            src: [ 'app/assets/**/*.es6' ]
            directives:
               node: true
               todo: true
            options:
               edition: 'latest'
               errorsOnly: false
               failOnError: false
               log: 'out/server-lint.log'
               checkstyle: 'out/server-checkstyle.xml'
         client:
            src: [ 'public/assets/**/*.es6' ]
            directives:
               browser: true
               predef: [ 'jQuery' ]
               todo: true
            options:
               edition: 'latest'
               errorsOnly: false
               failOnError: false
               log: 'out/client-lint.log'
               checkstyle: 'out/client-checkstyle.xml'


   grunt.loadNpmTasks('grunt-babel')
   grunt.loadNpmTasks('grunt-jslint')

   grunt.registerTask("default", ["jslint:server", "jslint:client","babel"])

