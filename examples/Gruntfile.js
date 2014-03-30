module.exports = function (grunt) {
  var TARGET_DIR = './target/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      todomvc: {
        src: [TARGET_DIR + './todomvc']
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
      github: ['github/github-*mocha*.js', 'github/github*jasmine*.js'],
      options: {
        reporter: 'spec',
        ui: 'bdd'
      }
    },
    connect: {
      todomvc: {
        options: {
          port: 9001,
          base: TARGET_DIR + './todomvc/'
        }
      },
      "todomvc-dev": {
        options: {
          keepalive: true,
          port: 9001,
          base: TARGET_DIR + './todomvc/'
        }
      }
    },
    jekyll: {
      options: {                          // Universal options
        src: TARGET_DIR + './todomvc'
      },
      serve: {                            // Another target
        options: {
          dest: TARGET_DIR + './todomvc/_site',
          drafts: false,
          serve: false
        }
      }
    },
    gitclone: {
      todomvc: {
        options: {
          repository: 'https://github.com/tastejs/todomvc.git',
          branch: 'gh-pages',
          directory: TARGET_DIR + './todomvc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-selenium-webdriver');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask(
      'todomvc',
      [
        'clean:todomvc',
        'gitclone:todomvc',
        'jekyll:serve',
        'connect:todomvc',
        'selenium_start',
        'mochacli:github'
      ]
  );
  grunt.registerTask(
      'todomvc-dev',
      [
        'jekyll:serve',
        'connect:todomvc-dev'
      ]
  );

  grunt.registerTask(
      'test',
      [
        'mochacli:github',
        'jshint'
      ]
  );
  grunt.registerTask('jshint', 'jshint');
  grunt.registerTask('default', 'test');
};
