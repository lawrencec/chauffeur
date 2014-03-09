module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    complexity: {
      generic: {
        src: ['lib/*.js'],
        options: {
          breakOnErrors: true,
          jsLintXML: 'target/complexity-report.xml',         // create XML JSLint-like report
          checkstyleXML: 'target/checkstyle.xml', // create checkstyle report
          errorsOnly: false,               // show only maintainability errors
          cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
          halstead: [8, 13, 20],           // or optionally a single value, like 8
          maintainability: 100
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    mochacli: {
      all: ['test/unit/**/*Spec.js', 'test/integration/*Spec.js'],
      unit: ['test/unit/**/*Spec.js'],
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
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'test/fixtures/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-selenium-webdriver');

  grunt.registerTask('test', ['mochacli:unit']);
  grunt.registerTask('test-int', ['selenium_start','connect:server', 'mochacli:int']);
  grunt.registerTask('ci', ['mochacli:all', 'jshint']);
  grunt.registerTask('complex', ['complexity']);
  grunt.registerTask('jshint', ['jshint']);
  grunt.registerTask('default', ['test']);
};
