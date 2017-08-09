/* eslint-disable */
const gulp = require('gulp');
const del = require('del');

gulp.task('cleanup-public', del.bind(
  null, ['public/*'], { dot: true }
));

gulp.task('copy-assets', function(){
  gulp.src('assets/**/*')
    .pipe(gulp.dest('public'))
});
