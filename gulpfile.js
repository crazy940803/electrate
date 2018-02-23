const child_process = require('child_process');
const electron = require('electron');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const css = require('gulp-css');
const packager = require('electron-packager');
const util = require('gulp-util');
const pkg = require('./package.json');

const destination = 'app/';

const babelrc = {
    presets: ['babel-preset-es2015', 'babel-preset-react'].map(require.resolve)
};

gulp.task('copy', () => {
    return gulp.src('src/index.html').pipe(gulp.dest(destination));
});

gulp.task('build-css', function(){
    return gulp.src('src/**/*.css')
        .pipe(css())
        .pipe(gulp.dest(destination));
});

gulp.task('build-main', () => {
    return gulp.src('main.js')
        .pipe(sourcemaps.init())
        .pipe(babel(babelrc))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destination));
});

gulp.task('build-js', () => {
        return gulp.src('src/**/*.js')
            .pipe(sourcemaps.init())
            .pipe(babel(babelrc))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(destination));
});

gulp.task('build', ['build-css', 'build-main', 'build-js']);

gulp.task('start', ['copy', 'build'], () => {
    child_process.spawn(electron, ['.'], { stdio: 'inherit' })
        .on('close', () => process.exit());
});

let packagerOptions = {
    platform: 'darwin',
    arch: 'all',
    asar: true,
    dir: './build',
    icon: './assets/icon.icns',
    name: pkg.name,
    out: './dist',
    overwrite: true,
    prune: true,
    version: pkg.electronVersion,
    'app-version': pkg.version
};
gulp.task('package', ['copy', 'build'], () => {

    packager(packagerOptions, (err, appPath) => {

    });
});
