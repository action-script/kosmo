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

      eslint:
         options:
            configFile: "eslint.json"
#            outputFile: "logs/eslint_report.log"
         target: [
            "app/assets/**/*.es6"
            "public/assets/scripts/**/*.es6"
         ]

   grunt.loadNpmTasks('grunt-babel')
   grunt.loadNpmTasks('grunt-eslint')

   grunt.registerTask("default", ["eslint","babel"])

