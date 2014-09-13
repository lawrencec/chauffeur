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
      int: ['test/integration/**/*Spec.js'],
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
      },
      debug: {
        options: {
          keepalive: true,
          port: 9001,
          base: 'test/fixtures/'
        }
      }
    },
    mocha_istanbul: {
      unit: {
        src: 'test/unit/', // the folder, not the files,
        options: {
          root: 'lib',
          recursive: true,
          mask: '**/*Spec.js',
          coverageFolder: 'target/unit/',
          reportFormats: ['lcov', 'text']
        }
      },
      integration: {
        src: 'test/integration/', // the folder, not the files,
        options: {
          root: 'lib',
          recursive: true,
          mask: '**/*Spec.js',
          coverageFolder: 'target/integration/',
          reportFormats: ['lcov', 'text']
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
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('test', ['mochacli:unit','hint']);
  grunt.registerTask('fixture-server', 'connect:server');
  grunt.registerTask('fixture-server-debug', 'connect:debug');
  grunt.registerTask('test-int', ['selenium_start','fixture-server', 'mochacli:int']);
  grunt.registerTask('ci', ['hint','coverage', 'coverage-int']);
  grunt.registerTask('complex', ['complexity']);
  grunt.registerTask('coverage', ['mocha_istanbul:unit']);
  grunt.registerTask('coverage-int', ['selenium_start','fixture-server','mocha_istanbul:integration']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('default', ['test']);
};
