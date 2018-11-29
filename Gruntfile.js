/*jshint camelcase: false */
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'build',
    docs: '<%= yeoman.app %>/docs',
    distDocs: 'devDocs'
  };

  grunt.loadNpmTasks('grunt-ngdocs');

  grunt.loadNpmTasks('grunt-markdown');

  grunt.loadNpmTasks('grunt-text-replace'); // Used to automatically replace the path to config.json in GLOBALCONFIGS

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    ngdocs: {
      options: {
        scripts: ['angular.js', '../src.js'],
        html5Mode: false,
        template: '<%= yeoman.docs %>/templates/index.tmpl',
        startPage: '/api',
        dest: '<%= yeoman.distDocs %>'
      },
      installation: {
        src: ['<%= yeoman.docs %>/installation/*.ngdoc'],
        title: 'Development Enviroment Preparation'
      },
      api: {
        src: ['<%= yeoman.docs %>/index.ngdoc', '<%= yeoman.app %>/src/evtviewer.js', '<%= yeoman.app %>/src/**/*.js', '!<%= yeoman.app %>/src/mobile/*.js'],
        title: 'EVT 2 Dev Documentation'
      }
    },

    markdown: {
      all: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/',
            src: '{,*/}*.md',
            dest: '<%= yeoman.dist %>',
            ext: '.html'
          }
        ]
      }
    },

    replace: {
      configPathBuild: {
        src: ['<%= yeoman.app %>/src/{,*/}*.js'],
        overwrite: true,
        replacements: [{
          from: '../../config/config.json',
          to: 'config/config.json'
        }]
      },
      configPathDev: {
        src: ['<%= yeoman.app %>/src/{,*/}*.js'],
        overwrite: true,
        replacements: [{
          from: 'config/config.json',
          to: '../../config/config.json'
        }]
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/src/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      /*babel: {
        files: ['<%= yeoman.app %>/src/dataHandler/search/searchDocument.service.js',
                '<%= yeoman.app %>/src/dataHandler/search/searchPoetry.service.js',
                '<%= yeoman.app %>/src/dataHandler/search/criticalEditionHandler.service.js'],
        tasks: ['babel']
      },*/
      webpack: {
        files: ['<%= yeoman.app %>/src/dataHandler/search/searchIndex.service.js',
               '<%= yeoman.app %>/src/dataHandler/search/searchQuery.service.js',
               '<%= yeoman.app %>/src/dataHandler/search/searchResults.service.js'],
         tasks: ['webpack']
      },
      // gruntfile: {
      //   files: ['Gruntfile.js']
      // },
      html: {
        files: [
            '<%= yeoman.app %>/src/**/*.tmpl.html'
        ],
        tasks: ['html2js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 37729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        reporterOutput: ''
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/src/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      docs: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.distDocs %>/{,*/}*',
            '!<%= yeoman.distDocs %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
      //,
      // TODO: temp mobile
      // mobile: {
      //   src: ['<%= yeoman.app %>/mobile.html'],
      //   ignorePath:  /\.\.\//
      // }
      // TODO: overwrite bootstrap style in EVT css
      // sass: {
      //   src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
      //   ignorePath: /(\.\.\/){1,2}bower_components\//
      // }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/src',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Compiles ES6 to ES5
    /*babel: {
       options: {
             sourceMap: true,
             presets: ['env']
       },
       dist: {
          files: {
             'app/dist/comp/searchDocument.service.js': 'app/src/dataHandler/search/searchDocument.service.js',
             'app/dist/comp/searchPoetry.service.js': 'app/src/dataHandler/search/searchPoetry.service.js',
             'app/dist/comp/criticalEditionHandler.service.js': 'app/src/dataHandler/search/criticalEditionHandler.service.js',
          }
       }
     },*/

    // Module bundler
    webpack: {
      options: {
        progress: true
      },
      app: require('./webpack.config')
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    html2js: {
        options: {
            base: '<%= yeoman.app %>/'
        },
        main: {
            module: 'templates-main',
            src: ['<%= yeoman.app %>/src/**/*.tmpl.html'],
            dest: '.tmp/tmpl/templates.js'
        }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    // htmlmin: {
    //   dist: {
    //     options: {
    //       collapseWhitespace: true,
    //       conservativeCollapse: true,
    //       collapseBooleanAttributes: true,
    //       removeCommentsFromCDATA: true,
    //       removeOptionalTags: true
    //     },
    //     files: [{
    //       expand: true,
    //       cwd: '<%= yeoman.dist %>',
    //       src: ['*.html', 'views/{,*/}*.html'],
    //       dest: '<%= yeoman.dist %>'
    //     }]
    //   }
    // },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html', '!<%= yeoman.dist %>/mobile.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            '!mobile.html',
            'README.md',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*',
            'config/{,*/}*.*',
            'i18n/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      docs: {
        expand: true,
        cwd: '<%= yeoman.docs %>',
        dest: '<%= yeoman.distDocs %>',
        src: []
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    injector: {
      options: {
        template: null,
        ignorePath: 'app/',
        sort: function (a, b) {
          return a.match(/\./g).length - b.match(/\./g).length;
        }
      },
      local_dependencies: {
        files: {
          '<%= yeoman.app %>/index.html': ['<%= yeoman.app %>/src/*/*.js']
          //'<%= yeoman.app %>/mobile.html': ['<%= yeoman.app %>/src/*/*.js']
        }
      }
    }
  });


  grunt.registerTask('dev', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      // 'injector',
      'html2js:main',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      /*babel*/
      'webpack',
      'connect:livereload',
      'watch'
    ]);
  });

  // grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
  //   grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
  //   grunt.task.run(['serve:' + target]);
  // });
   //grunt.registerTask('default', ['babel']);
  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    // 'injector',
    'replace:configPathBuild',
    'html2js:main',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'markdown',
    'replace:configPathDev'
    // 'htmlmin'
  ]);

  grunt.registerTask('docs', ['clean', 'ngdocs', 'copy:docs']);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
