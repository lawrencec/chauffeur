module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    complexity: {
      generic: {
        src: ['lib/**/*.js'],
        options: {
          errorsOnly: false,
          cyclometric: 6,       // default is 3
          halstead: 16         // default is 8
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'app/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    mochacli: {
      all: ['test/unit/*Spec.js', 'test/integration/*Spec.js'],
      unit: ['test/unit/*Spec.js'],
      int: ['test/integration/*Spec.js'],
      options: {
        reporter: 'spec',
        ui: 'bdd'
      }
    },
    watch: {
      js: {
        files: ['**/*.js', '!node_modules/**/*.js'],
        tasks: ['default'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');


  grunt.registerTask('test', ['mochacli:unit', 'complexity', 'jshint', 'watch']);
  grunt.registerTask('test-int', ['mochacli:int', 'complexity', 'jshint', 'watch']);
  grunt.registerTask('ci', ['mochacli:all', 'complexity', 'jshint']);
  grunt.registerTask('default', ['test']);
};
