var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-multi');
var _concat = require('gulp-concat-util');

gulp.task('build', function(cb) {
    concat({
            "arbor.js": ["src/pollyfill/assign.js", "src/etc.js", "src/kernel.js", "src/physics/atoms.js", "src/physics/system.js", "src/physics/barnes-hut.js", "src/physics/physics.js", "src/index.js"],
            "arbor-tween.js": ["src/etc.js","src/graphics/colors.js", "src/tween/easing.js", "src/tween/tween.js"]

        })
        .pipe(_concat.header('(function($, window, document, undefined) {\n\'use strict\';\n'))
        .pipe(_concat.footer('\n})(this.jQuery, window, document);\n'))
        .pipe(uglify())
        .pipe(gulp.dest('lib'));
});

gulp.task('dependencies', function(cb) {
    concat({
            'physics/worker.js': "src/physics/worker.js",
            'physics/atoms.js': "src/physics/atoms.js",
            'physics/barnes-hut.js': "src/physics/barnes-hut.js",
            'physics/physics.js': "src/physics/physics.js",
            'physics/system.js': "src/physics/system.js"
        })
        .pipe(uglify())
        .pipe(gulp.dest('lib'));
});
