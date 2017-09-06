'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const ifElse = require('gulp-if-else');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge-stream');

const browserify = require('browserify');
const babelify = require('babelify');
const stripify = require('stripify');
const watchify = require('watchify');
const collapse = require('bundle-collapser/plugin');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const path = require('path');
const glob = require('glob');

const config = require('./config');
const listPath = require('./list-path');

gulp.task('js-ie8-bundle', () => {
	return gulp.src([
		config.paths.bower('html5shiv/html5shiv.js'),
		config.paths.bower('respond/dest/respond.src.js')
	])
		.pipe(concat('ie8-support.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.paths.dest('js')));
});

gulp.task('js-vendor-bundle', () => {
	return gulp.src([
		config.paths.module('jquery/dist/jquery.js'),
		config.paths.module('bootstrap/dist/js/bootstrap.js'),
		config.paths.module('parsleyjs/dist/parsley.js'),
		config.paths.module('parsleyjs/dist/i18n/zh_cn.js'),
		config.paths.module('parsleyjs/dist/i18n/zh_cn.extra.js')
	])
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.paths.dest('js')));
});

function makeEntries() {
	const src = config.paths.source('js');
	let entries = {};
	let folders = listPath(src);
	folders.map((folder) => {
		let files = glob.sync(config.paths.source("js/**/main-*.js"))
			.map((file) => './' + file);
		if (files.length > 0) {
			entries[folder] = files;
		}
	});
	return entries;
}

function createBundle(files) {
	const opt = Object.assign({}, watchify.args, {
		cache: {},
		packageCache: {},
		entries: files
	});

	let bundle = browserify(opt);
	bundle.ignore('jquery').transform(babelify, {
		presets: ["es2015"]    // transform js code from es6 to es5
	})
		.plugin([collapse]);   //  use numbers instead 'real path' as key in require map

	if (config.isPROD) {
		bundle = bundle.transform(stripify);    // remove comment from code
	}
	if (!config.isPROD) {
		bundle = watchify(bundle);
	}
	return bundle;
}

function runBundle(bundle, name) {
	return bundle.bundle()
		.pipe(source(name + '.js'))
		.pipe(buffer())
		.pipe(ifElse(config.isPROD, uglify))
		.pipe(gulp.dest(config.paths.dest('js')));
}

gulp.task('js-app-bundle', () => {
	const entries = makeEntries();

	const tasks = [];
	for (const key in entries) {
		if (entries.hasOwnProperty(key)) {
			const bundle = createBundle(entries[key]);

			bundle.on('update', () => runBundle(bundle, key))
				.on('error', gutil.log.bind(gutil, 'Browserify Error'))
				.on('log', (log) => {
					gutil.log('file in ' + key + ' has been changed, ' + log);
				});
			tasks.push(runBundle(bundle, key));
		}
	}
	return merge(tasks);
});

module.exports = ['js-ie8-bundle', 'js-vendor-bundle', 'js-app-bundle'];