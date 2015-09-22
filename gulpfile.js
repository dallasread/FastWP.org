var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    stringify = require('stringify'),
    argv = require('yargs').argv,
    header = require('gulp-header'),
    production = !!argv.production;

console.log('ENV:', production ? 'Production' : 'Development');

gulp.task('js', function() {
    var bundler = browserify({
        entries: ['./js/app/index.js']
    })
    .transform(
        stringify({
            extensions: ['.html', '.md', '.hbs'],
            minify: false,
            minifier: {
                extensions: ['.html'],
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                }
            }
        })
    );

    var bundle = function() {
        return bundler
            .bundle()
            .pipe(source('./js/app/index.js'))
            .pipe(buffer())
            .pipe(rename('fwp.js'))
            .pipe(gulp.dest('./js'))
            // .pipe(gulpif(production, uglify()))
            // .pipe(gulpif(production, gulp.dest('./js/fwp.js')));
    };

    return bundle();
});

gulp.task('scss', function () {
    gulp.src('./scss/index.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(header('/*\nTheme Name: FastWordPress.org\nAuthor: Dallas Read\nAuthor URI: http://dallasread.com/\nDescription: Theme for FastWordPress.org\nVersion: 1.0\nLicense: MIT\nTags: responsive, fast\n*/'))
        .pipe(rename('./style.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', ['default'], function(){
    gulp.watch(['scss/**/*'], ['scss']);
    gulp.watch(['js/**/*'], ['js']);
});

gulp.task('default', ['scss', 'js']);
