'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');

const config = require('./gulp_tasks/config');

const tasks = ['clean', 'js-bundle', 'css-bundle', 'static'];
if (config.isPROD) {
	tasks.push('manifest');
} else {
	tasks.push('watch');
}

tasks.forEach(task => gulp.task(task, require('./gulp_tasks/' + task)));

gulp.task('default', () => sequence.apply(sequence, tasks));
