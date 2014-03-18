module.exports = function(grunt) {
  grunt.registerTask('log-foo', function() {
    grunt.log.write('foo');
  });
};
