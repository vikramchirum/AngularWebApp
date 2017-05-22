/**
 * Created by patrick.purcell on 5/22/2017.
 */
module.exports = function (grunt) {

  grunt.initConfig({
    copy: {
      dev: {
        expand: true,
        cwd: 'dist',
        src: '**',
        dest: '//gesvr1090/e$/inetpub/wwwroot/dev/mygexa.gexaenergy.com/'
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('deploy-dev', ['copy:dev']);
};
