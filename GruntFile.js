/**
 * Created by patrick.purcell on 6/2/2017.
 */
module.exports = function ( grunt ) {

  var pkg = grunt.file.readJSON( 'package.json' );

  var octo_api_url = grunt.option( 'octo_api_url' ) || '';
  var octo_api_key = grunt.option( 'octo_api_key' ) || '';

  grunt.initConfig( {
    clean: {
      build: [ './pkg/**/*' ]
    },
    gitinfo:{ },
    'octo-pack': {
      prod: {
        options: {
          dst: './pkg',
          version: pkg.version + '-<%= version_suffix %>'
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
      }
    }
  } );

  grunt.task.registerTask( 'generate_version', 'Create version based off branch name', function () {

    var branch_name = grunt.config.get( 'gitinfo.local.branch.current.name' );
    branch_name = branch_name.replace( /\\/g, "-" ).replace( /\//g, "-" ).replace( /_/g, "-" );

    var version_suffix = '';
    var short_sha = grunt.config.get( 'gitinfo.local.branch.current.shortSHA' );

    var date_stamp = grunt.template.today( 'yyyymmddHHMMss' );

    if ( branch_name ) {
      if ( branch_name === 'dev' )
        version_suffix += branch_name + '-' + date_stamp + '-' + short_sha;
      else if ( branch_name === 'master' )
        version_suffix += 'release';
      else if ( branch_name.startsWith( 'feature' ) || branch_name.startsWith( 'bugfix' ) ) {
        var split = branch_name.split( '-' );
        grunt.log.writeln(split);
        split = split.slice( 0, 3 );
        grunt.log.writeln(split);
        split.splice( 1, 0, date_stamp );
        grunt.log.writeln(split);
        var feature_branch_name = split.join( '-' );
        version_suffix += feature_branch_name;
      }
      else
        version_suffix += branch_name;
    }

    grunt.log.writeln( 'branch: ' + branch_name );
    grunt.log.writeln( 'sha: ' + short_sha );

    grunt.config.set( 'version_suffix', version_suffix );

    grunt.log.writeln( 'version: ' + grunt.config.get( 'version_suffix' ) );

  } );

  grunt.registerTask('build', ['copy:config', 'clean', 'gitinfo', 'generate_version', 'octo-pack']);

  grunt.registerTask( 'publish', ['copy:config', 'clean', 'gitinfo', 'generate_version', 'octo-pack', 'octo-push']);

  require( 'load-grunt-tasks' )( grunt );
};
