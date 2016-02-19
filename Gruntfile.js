module.exports = function (grunt) {

  grunt.initConfig({
    pkg:     grunt.file.readJSON('package.json'),
    concat:  {
      options:     {
        //separator: ';'
      },
      scripts:     {
        src:  ['preproc/app.js', 'preproc/script.js', 'preproc/directives.js', 'preproc/controllers/*.js'],
        dest: 'dist/scripts.js'
      },
      styles:      {
        src:  ['app/styles/*.css'],
        dest: 'preproc/sugar.css'
      }
    },
    uglify:  {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          //'dist/scripts.min.js':     '<%= concat.scripts.dest %>',
          //'dist/controllers.min.js': '<%= concat.controllers.dest %>'
        }
      }
    },
    cssmin:  {
      target: {
        files: {
          'dist/sugar.min.css': ['<%= concat.styles.dest %>']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments:     true,
          collapseWhitespace: true
        },
        files:   {
          'dist/index.html': 'app/index.html',
          'preproc/minHTML/404.html': 'app/views/404.html',
          'preproc/minHTML/about.html': 'app/views/about.html',
          'preproc/minHTML/base_stats.html': 'app/views/base_stats.html',
          'preproc/minHTML/battle_emulate.html': 'app/views/battle_emulate.html',
          'preproc/minHTML/constructing.html': 'app/views/constructing.html',
          'preproc/minHTML/damageCalculator.html': 'app/views/damageCalculator.html',
          'preproc/minHTML/home.html': 'app/views/home.html',
          'preproc/minHTML/IVCalculator.html': 'app/views/IVCalculator.html',
          'preproc/minHTML/IVCalculator_ori.html': 'app/views/IVCalculator_ori.html',
          'preproc/minHTML/moves.html': 'app/views/moves.html',
          'preproc/minHTML/show_poke.html': 'app/views/show_poke.html',
          'preproc/minHTML/skim.html': 'app/views/skim.html',
          'preproc/minHTML/stat_editor.html': 'app/views/stat_editor.html',
          'preproc/minHTML/suggestion.html': 'app/views/suggestion.html',
          'preproc/minHTML/team_builder.html': 'app/views/team_builder.html',
          'preproc/minHTML/directives/curEditing.html': 'app/views/directives/curEditing.html',
          'preproc/minHTML/directives/itemSelector.html': 'app/views/directives/itemSelector.html',
          'preproc/minHTML/directives/moveInList.html': 'app/views/directives/moveInList.html',
          'preproc/minHTML/directives/moveSelector.html': 'app/views/directives/moveSelector.html',
          'preproc/minHTML/directives/pmInList.html': 'app/views/directives/pmInList.html',
          'preproc/minHTML/directives/pmInTeam.html': 'app/views/directives/pmInTeam.html',
          'preproc/minHTML/directives/pmSelector.html': 'app/views/directives/pmSelector.html',
          'preproc/minHTML/directives/pokeCanLearn.html': 'app/views/directives/pokeCanLearn.html',
          'preproc/minHTML/directives/typeWrapper.html': 'app/views/directives/typeWrapper.html'
        }
      }
    },
    clean:   {
      preproc: ['preproc']

    },
    wiredep: {
      task: {
        src:     [
          'app/index.html'
        ],
        options: {
          exclude: ['/angular-messages/', '/angular-local-storage/']
        }
      }
    },
    cdnify:  {
      options: {
        cdn: require('google-cdn-data')
      },
      dist:    {
        html: ['dist/index.html']
      }
    },
    replace: {
      otherDeps: {
        options: {
          patterns: [
            {
              match: /\.\.\/other_dependencies/g,
              replacement: 'deps'
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      scripts: {
        options: {
          patterns: [
            {
              match: /<script src="scripts\/.*?.js"><\/script>/g,
              replacement: ''
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      styleConcated: {
        options: {
          patterns: [
            {
              match: /<\/head>/g,
              replacement: '<link rel="stylesheet" href="sugar.min.css"></head>'
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      scriptConcated: {
        options: {
          patterns: [
            {
              match: /<\/body>/g,
              replacement: '<script src="scripts.js"></script></body>'
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      styles: {
        options: {
          patterns: [
            {
              match: /<link rel="stylesheet" href="styles\/.*?">/g,
              replacement: ''
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      angularMaterial: {
        options: {
          patterns: [
            {
              match: /\.\.\/bower_components\/angular-material\/angular-material\./g,
              replacement: '//ajax.useso.com/ajax/libs/angular_material/1.0.0/angular-material.min.'
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      bugOfGoogleCdn: {
        options: {
          patterns: [
            {
              match: /\.\.\/\/ajax\.googleapis\.com/g,
              replacement: '//ajax.useso.com'
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-google-cdn');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('default', ['concat', 'cssmin', 'cdnify', 'replace', 'clean']);

};