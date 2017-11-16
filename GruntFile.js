/**
 * Created by patrick.purcell on 6/2/2017.
 */
module.exports = function ( grunt ) {

  var path = grunt.option( 'deploypath' );

  var branch_name = grunt.option( 'branch_name' );
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
          version: ''
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

  grunt.registerTask( 'octopack', function () {

    var pkg = grunt.file.readJSON( 'package.json' );
    var version = pkg.version;

    if ( branch_name !== 'dev' && branch_name !== 'master' ) {
      branch_name = branch_name.replace("\\", "-")
      version += '-' + branch_name;
    }

    grunt.log.writeln( 'Version: ' + pkg.version );

    grunt.config.set( 'octo-pack.prod.options.version', version );
    grunt.task.run( 'octo-pack:prod' );

  } );

  grunt.registerTask( 'publish', function () {

    if ( branch_name === 'dev' ) {
      grunt.task.run( 'bump-only:patch', 'copy:config', 'clean', 'octopack', 'octo-push' );
    }
    else if ( branch_name === 'master' ) {
      grunt.task.run( 'bump-only:minor', 'copy:config', 'clean', 'octopack', 'octo-push' );
    }
    else {
      grunt.task.run( 'copy:config', 'clean', 'octopack', 'octo-push' );
    }


  } );

  require( 'load-grunt-tasks' )( grunt );
};
