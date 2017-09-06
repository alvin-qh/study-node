'use strict';

const gulp = require('gulp');
const rev = require('gulp-rev');
const replace = require('gulp-rev-collector');
const clean = require('gulp-clean');
const ifElse = require('gulp-if-else');
const sequence = require('run-sequence');
const minifyHTML = require('gulp-minify-html');
const merge = require('merge-stream');

const glob = require('glob');
const path = require('path');
const config = require('./config');

gulp.task('manifest-css', () => {
	const files = glob.sync(config.paths.dest('css/**/*.css'));

	return merge(
		gulp.src(files)
			.pipe(rev())
			.pipe(gulp.dest(config.paths.dest('css')))
			.pipe(rev.manifest({path: 'manifest-css.json'}))
			.pipe(gulp.dest(config.paths.dest('css'))),
		gulp.src(files)
			.pipe(clean({force: true}))
	);
});

gulp.task('manifest-js', () => {
	const files = glob.sync(config.paths.dest('js/**/*.js'));

	return merge(
		gulp.src(files)
			.pipe(rev())
			.pipe(gulp.dest(config.paths.dest('js')))
			.pipe(rev.manifest({path: 'manifest-js.json'}))
			.pipe(gulp.dest(config.paths.dest('js'))),
		gulp.src(files)
			.pipe(clean({force: true}))
	);
});

gulp.task('manifest-fonts', () => {
	const files = glob.sync(config.paths.dest('fonts/**/*'));

	return merge(
		gulp.src(files)
			.pipe(rev())
			.pipe(gulp.dest(config.paths.dest('fonts')))
			.pipe(rev.manifest({path: 'manifest-fonts.json'}))
			.pipe(gulp.dest(config.paths.dest('fonts'))),
		gulp.src(files)
			.pipe(clean({force: true}))
	);
});

gulp.task('manifest-image', () => {
	const files = glob.sync(config.paths.dest('image/**/*'));

	return merge(
		gulp.src(files)
			.pipe(rev())
			.pipe(gulp.dest(config.paths.dest('image')))
			.pipe(rev.manifest({path: 'manifest-image.json'}))
			.pipe(gulp.dest(config.paths.dest('image'))),
		gulp.src(files)
			.pipe(clean({force: true}))
	);
});

gulp.task('replace-css', () => {
	return gulp.src([
		config.paths.dest('**/manifest-*.json'),
		config.paths.dest('css/**/*.css')
	])
		.pipe(replace())
		.pipe(gulp.dest('www/asset/css'))
});

gulp.task('replace-js', () => {
	return gulp.src([
		config.paths.dest('**/manifest-*.json'),
		config.paths.dest('js/**/*.js')
	])
		.pipe(replace())
		.pipe(gulp.dest('www/asset/js'))
});

gulp.task('replace-template', () => {
	return gulp.src([
		config.paths.dest('**/manifest-*.json'),
		config.paths.template('**/*.html')
	])
		.pipe(replace({
			replaceReved: true,
			dirReplacements: {
				'css/': 'css/',
				'js/': 'js/',
				'image/': 'image/'
			}
		}))
		.pipe(gulp.dest('www/view'));
});

gulp.task('replace',
	['manifest-css', 'manifest-js', 'manifest-fonts', 'manifest-image'],
	() => sequence('replace-css', 'replace-js', 'replace-template'));

module.exports = ['replace'];
