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

// gulp.task('js', function() {
//     var bundler = browserify({
//         entries: ['./index.js']
//     })
//     .transform(
//         stringify({
//             extensions: ['.html', '.md', '.hbs'],
//             minify: false,
//             minifier: {
//                 extensions: ['.html'],
//                 options: {
//                     removeComments: true,
//                     collapseWhitespace: true
//                 }
//             }
//         })
//     );

//     var bundle = function() {
//         return bundler
//             .bundle()
//             .pipe(source('brilliantlabs.js'))
//             .pipe(buffer())
//             .pipe(gulp.dest('./dist'))
//             .pipe(rename('../public/brilliantlabs-dev.js'))
//             .pipe(gulp.dest('../brilliantlabs-dev.js'))
//             .pipe(gulpif(production, uglify()))
//             .pipe(gulpif(production, rename('../public/brilliantlabs.js')))
//             .pipe(gulpif(production, gulp.dest('../brilliantlabs.js')));
//     };

//     return bundle();
// });

gulp.task('scss', function () {
    gulp.src('./scss/index.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(header('/*\nTheme Name: FastWordPress.org\nAuthor: Dallas Read\nAuthor URI: http://dallasread.com/\nDescription: Theme for BrilliantLabs.ca\nVersion: 1.0\nLicense: MIT\nTags: responsive, brilliant\n*/'))
        .pipe(rename('./style.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', ['default'], function(){
    gulp.watch(['scss/**/*'], ['scss']);
});

gulp.task('default', ['scss']);
