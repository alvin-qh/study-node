import gulp from 'gulp';
import clean from 'gulp-clean';

import config from './config';

gulp.task('clear-dest', () => {
	return gulp.src([config.paths.dest()])
		.pipe(clean({force: true}));
});

gulp.task('clear-view', () => {
	return gulp.src([config.paths.view()])
		.pipe(clean({force: true}));
});

export default ['clear-dest', 'clear-view'];