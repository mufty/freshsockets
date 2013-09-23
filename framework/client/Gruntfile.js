module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/', 
            src: ['**/*.js'],
            dest: 'build/',
            ext: '.min.js'
          }
        ]
      },
      build: {
        src: 'src/**.*js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    
    replace: {
      example: {
        src: ['build/**/*.js', '!build/<%= pkg.name %>.min.js'],
        dest: 'build/',
        replacements: [{ 
          from: 'alert',
          to: 'b' 
        }]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');

  // Default task(s).
  grunt.registerTask('default', ['uglify:build']);
  grunt.registerTask('dev', ['uglify:dev','replace']);

};