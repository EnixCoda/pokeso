module.exports = function (grunt) {

  grunt.initConfig({
    pkg:     grunt.file.readJSON('package.json'),
    concat:  {
      options:     {
        separator: ';'
      },
      scripts:     {
        src:  ['app/scripts/*.js'],
        dest: 'dist/concated/scripts.js'
      },
      controllers: {
        src:  ['app/scripts/controllers/*.js'],
        dest: 'dist/concated/controllers.js'
      },
      styles:      {
        src:  ['app/styles/*.css'],
        dest: 'dist/concated/sugar.css'
      }
    },
    uglify:  {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist:    {
        files: {
          'dist/scripts.min.js':     '<%= concat.scripts.dest %>',
          'dist/controllers.min.js': '<%= concat.controllers.dest %>'
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

        }
      }
    },
    clean:   {
      concated: ['dist/concated/']
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
        html: ['app/index.html']
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

  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'clean']);
}