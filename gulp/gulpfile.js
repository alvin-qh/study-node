import gulp from 'gulp';
import sequence from 'run-sequence';
import config from './gulp_tasks/config';

const tasks = ['clean', 'js-bundle', 'css-bundle', 'static'];

if (config.isPROD) {
    tasks.push('manifest');
} else {
    tasks.push('watch');
}

tasks.forEach(task => gulp.task(task, require('./gulp_tasks/' + task).default));

gulp.task('default', () => sequence.apply(sequence, tasks));


