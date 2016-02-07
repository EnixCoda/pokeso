module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      scripts: {
        src: ['app/scripts/*.js'],
        dest: 'dist/scripts.js'
      },
      controllers: {
        src: ['app/scripts/controllers/*.js'],
        dest: 'dist/controllers.js'
      },
      styles: {
        src: ['app/styles/*.css'],
        dest: 'dist/sugar.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist:{
        files: {
          'dist/scripts.min.js': '<%= concat.scripts.dest %>',
          'dist/controllers.min.js': '<%= concat.controllers.dest %>'
        }
      }
    },
    clean: {
      concated: ['dist/scripts.js', 'dist/controllers.js']
    },
    wiredep: {
      task: {
        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          'app/index.html'
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:
          exclude: ['/angular-messages/', '/angular-local-storage/']
          // https://github.com/taptapship/wiredep#configuration
        }
      }
    },
    cdnify: {
      options: {
        cdn: require('google-cdn-data')
      },
      dist: {
        html: ['app/index.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-google-cdn');

  grunt.registerTask('default', ['concat', 'uglify', 'clean']);
}