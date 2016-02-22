module.exports = (grunt) ->

   grunt.initConfig
      babel:
         options:
            sourceMap: true
            comments: false
         all:
            files: [
               expand: true,
               cwd: 'dev/src',
               src: ['**/*.es6'],
               dest: 'dev/build',
               ext: '.js'
            ]

   grunt.loadNpmTasks('grunt-babel')

   grunt.registerTask("default", ["babel"])

