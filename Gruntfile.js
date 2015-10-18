module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    site: grunt.file.readYAML('config.yml'),
    rateskey: (process.env.OPENEXCHANGERATES_APP_ID || '9c3a9fa4d4b7415e95880e677db3d080'),
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.dest %>/assets',
        helpers: ['handlebars-helper-rel', 'handlebars-helper-compose', '<%= site.templates %>/helpers/*.js'],
        partials: '<%= site.templates %>/partials/*.hbs',
        layoutdir: '<%= site.templates %>/layouts/',
        layoutext: '.hbs',
        data: ['<%= site.data %>/*.json', '<%= site.data %>/*.yml'],
        site: '<%= site %>'
      },
      site: {
        options: {
          layout: 'content'
        },
        files: {
          '<%= site.dest %>/': '<%= site.templates %>/*.hbs'
        }
      },
      products: {
        options: {
          layout: 'product'
        },
        files: {
          '<%= site.dest %>/products/': '<%= site.data %>/*.md'
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compact'
        },
        files: {
          '<%= site.dest %>/assets/css/app.css': '<%= site.assets %>/sass/app.scss'
        }
      }
    },
    copy: {
      assets: {
        files: [
          {
            expand: true,
            cwd: '<%= site.assets %>/public',
            src: ['**'],
            dest: '<%= site.dest %>/assets'
          },
          {
            expand: true,
            cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
            src: ['**'],
            dest: '<%= site.dest %>/assets/fonts'
          }
        ]
      },
    },
    curl: {
      rates: {
        src: 'https://openexchangerates.org/api/latest.json?app_id=<%= rateskey %>',
        dest: '<%= site.data %>/rates.json'
      }
    },
    clean: {
      dist: '<%= site.dest %>/'
    },
    connect: {
      site: {
        options: {
          open: true,
          port: 9000,
          base: ['<%= site.dest %>']
        }
      }
    },
    watch: {
      sass: {
        files: ['<%= site.assets %>/sass/**/*.scss'],
        tasks: ['sass']
      },
      templates: {
        files: ['<%= site.templates %>/**/*.hbs'],
        tasks: ['assemble']
      },
      data: {
        files: ['<%= site.data %>/**/*.*'],
        tasks: ['assemble']
      },
      assets: {
        files: ['<%= site.assets %>/public/**/*.*'],
        tasks: ['copy']
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-curl');

  grunt.registerTask('update', ['curl:rates']);
  grunt.registerTask('design', ['clean', 'copy', 'sass', 'assemble', 'connect', 'watch']);
  grunt.registerTask('default', ['clean', 'copy', 'sass', 'assemble']);
};
