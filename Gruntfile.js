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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['concat', 'uglify', 'clean']);
}