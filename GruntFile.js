/**
 * Created by patrick.purcell on 6/2/2017.
 */
module.exports = function ( grunt ) {

  var path = grunt.option( 'deploypath' );

  grunt.initConfig( {
    clean: {
      build: [ './pkg/**/*' ]
    },
    "octo-pack": {
      prod: {
        options: {
          dst: './pkg'
        },
        cwd: './dist',
        src: [ '**/*']
      }
    },
    "octo-push": {
      options: {
        host: 'http://octopus',
        apiKey: 'API-FLRBYNHIX14CXBV82R6CH7BGYEY',
        replace: true
      },
      src: [ './pkg/**/*' ]
    },
    copy: {
      config:{
        expand: true,
        cwd: 'publish',
        src: 'web.config',
        dest: './dist'
      },
      deploy: {
        expand: true,
        cwd: 'dist',
        src: '**',
        dest: path
      }
    }
  } );

  grunt.registerTask('publish',  ['bump-only', 'copy:config', 'clean', 'octo-pack:prod', 'octo-push']);

  require( 'load-grunt-tasks' )( grunt );
};
