/*
 * grunt-checkbranch
 * https://github.com/dymonaz/grunt-checkbranch
 *
 * Copyright (c) 2013 Dominykas Blyžė
 * Licensed under the MIT license.
 */

'use strict';

var shell = require("shelljs");

module.exports = function (grunt) {

  function getCurrentBranch() {
    var branchOutput = shell.exec("git rev-parse --abbrev-ref HEAD", {silent: true});
    if (branchOutput.code !== 0) {
      grunt.fail.fatal("Failed to detect the current branch");
    }

    return branchOutput.output.trim();
  }

  grunt.registerTask('checkbranch', 'Check that we are on a correct Git branch before proceeding.', function(expectedBranch, force) {
    var isCorrectBranch;
    var options = this.options({
      force: force,
      expectedBranch: expectedBranch || "master"
    });
    var isDisabled = grunt.option('no-checkbranch') && !options.force;
    var isNegated = options.expectedBranch[0] === "!";
    var currentBranch = getCurrentBranch();


    function template(str) {
      return str.
        replace("{expectedBranch}", expectedBranch).
        replace("{currentBranch}", currentBranch).
        replace("{not?}", isNegated ? " not" : "");
    }

    expectedBranch = isNegated ? options.expectedBranch.slice(1) : options.expectedBranch;
    isCorrectBranch = isNegated ? currentBranch !== expectedBranch : currentBranch === expectedBranch;

    if (isDisabled) {
      grunt.log.writeln("Branch check overridden via command line.");
      return;
    }

    grunt.log.writeln(template("Expecting to{not?} be on {expectedBranch} branch"));

    if (!isCorrectBranch) {
      grunt.fail.fatal(template(
        isNegated ?
          "Anything except '{expectedBranch}' branch is allowed, and you're on '{currentBranch}' branch." :
          "Only '{expectedBranch}' is allowed, and you're on '{currentBranch}' branch"
      ));
    }

  });

};
