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

