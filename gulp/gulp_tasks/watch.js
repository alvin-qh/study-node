'use strict';

const gulp = require('gulp');
const path = require('path');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sequence = require('run-sequence');
const config = require('./config');
const cssBundle = require('./css-folder-bundle');

gulp.task('watch-css', () => {
	gulp.watch(config.paths.source('css/**/*.css'), e => {
		gutil.log('file "' + e.path + '" is ' + e.type);

		const pathName = path.dirname(e.path);
		const folder = path.relative(config.paths.source('css'), pathName);

		cssBundle(folder);
	});
});

gulp.task('watch-template', () => {
	gulp.watch(config.paths.template('**/*.html'), e => {
		gutil.log('file "' + e.path + '" is ' + e.type);
		gulp.src(e.path).pipe(gulp.dest(config.paths.view()));
	});
});

module.exports = ['watch-css', 'watch-template'];