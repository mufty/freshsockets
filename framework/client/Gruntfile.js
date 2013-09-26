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
    },
    
    requirejs: {
      production: {
  		options: {
  			almond: true,
  			name: "core",
        	baseUrl: "src",
        	mainConfigFile: "src/core.js",
        	skipModuleInsertion: false,
  			out: "build/production/<%= pkg.name %>.min.js",
  			wrap: true
  		}
  	  },
  	  
  	  developement: {
  		options: {
  			almond: true,
  			name: "core",
        	baseUrl: "src",
        	mainConfigFile: "src/core.js",
        	skipModuleInsertion: false,
  			out: "build/dev/<%= pkg.name %>.js",
  			optimize: "none",
  			wrap: false
  		}
  	  }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-requirejs');

  // Default task(s).
  //grunt.registerTask('default', ['uglify:build']);
  grunt.registerTask('default', ['requirejs:production']);
  //grunt.registerTask('dev', ['uglify:dev','replace']);
  grunt.registerTask('dev', ['requirejs:developement']);

};