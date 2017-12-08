/**
 * Created by patrick.purcell on 6/2/2017.
 */
module.exports = function ( grunt ) {

  var path = grunt.option( 'deploypath' );
  if (!path){
    path = 'c:\\inetpub\\wwwroot\\dev\\test';
  }

  var pkg = grunt.file.readJSON( 'package.json' );
  var version = pkg.version;

  var branch_name = grunt.option( 'branch_name' );
  if ( branch_name && branch_name !== 'dev' && branch_name !== 'master' ) {
    branch_name = branch_name.replace("\\", "-").replace("/", "-");
    version += '-' + branch_name;
  }

  var octo_api_url = grunt.option( 'octo_api_url' );
  var octo_api_key = grunt.option( 'octo_api_key' );

  grunt.initConfig( {
    clean: {
      build: [ './pkg/**/*' ]
    },
    'octo-pack': {
      prod: {
        options: {
          dst: './pkg',
          version: version
        },
        cwd: './dist',
        src: [ '**/*' ]
      }
    },
    'octo-push': {
      options: {
        host: octo_api_url,
        apiKey: octo_api_key,
        replace: true
      },
      src: [ './pkg/**/*' ]
    },
    copy: {
      config: {
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

  grunt.registerTask( 'publish', ['copy:config', 'clean', 'octo-pack', 'octo-push']);

  require( 'load-grunt-tasks' )( grunt );
};
