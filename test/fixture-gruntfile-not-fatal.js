module.exports = function(grunt) {

  grunt.loadTasks('../tasks');
  grunt.loadTasks('../test/fixture-tasks');

  grunt.initConfig({
    checkbranch: {
      options: {
        fatal: false
      }
    }
  });
};