/**
 * Created by patrick.purcell on 6/2/2017.
 */
module.exports = function (grunt) {

  var path = grunt.option('deploypath');

  grunt.initConfig({
     copy:{
       deploy: {
         expand: true,
         cwd: 'dist',
         src: '**',
         dest: path
       }
     }
  });

  require('load-grunt-tasks')(grunt);
};
