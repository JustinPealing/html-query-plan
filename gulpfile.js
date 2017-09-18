const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const sm = require('gulp-sourcemaps');
const through = require('through2');

const tsproj = ts.createProject('./tsconfig.json');

const resources = [
    'src/qp.xslt'
];

gulp.task('compile', () => {
    let tsResult = gulp.src(['src/**/*.ts', 'typings/**/*.ts'])
        .pipe(tsproj());
    
    let move = gulp.src(resources);

    return merge([
        tsResult.dts.pipe(gulp.dest('./out/')),
        tsResult.js.pipe(gulp.dest('./out/')),
        move.pipe(gulp.dest('./out/'))
    ]);
});
