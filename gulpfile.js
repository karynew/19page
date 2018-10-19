var gulp = require('gulp'),
		plumber = require('gulp-plumber'), // Valida errores
		uglify = require('gulp-uglify'), // Minifica archivos js
		concat = require('gulp-concat'), // Unir archivos
		data = require('gulp-data'),// plugin para trabnjar json data
		sass = require('gulp-sass'), // Preprocesador css
		watch = require('gulp-watch'), // Monitorea las funciones generadas
		browserSync = require ('browser-sync').create(),
		nunjucksRender = require('gulp-nunjucks-render');

gulp.task('nunjucks', function() {
	return gulp.src('pages/**/*.+(html|nunjucks)')
	// Adding data to Nunjucks
	 .pipe(data(function() {
		 return require('./data.json')
	 }))
	.pipe(nunjucksRender({
		path: ['templates']
	}))
	.pipe(gulp.dest('dist'))
});

gulp.task('sass2css', function() {
	gulp.src('styles/*.scss')
	.pipe(plumber())
	.pipe(sass({
		sass: sass,
		pretty: true

		}))
	.pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
	gulp.src('scripts/*.js')
	.pipe(concat('scripts.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function() {
	gulp.watch('pages/**/*.+(html|nunjucks)', ['nunjucks']);
	gulp.watch('styles/*.scss', ['sass2css']);
	gulp.watch('scripts/*.js', ['scripts']);
	browserSync.init({
		server:{
			baseDir: "dist"
		}
	});
	watch('pages/**/*.+(html|nunjucks)', function(){
		gulp.start('htmlInject')
		// browserSync.reload();
	});
	watch('templates/partials/**/*.+(html|nunjucks)', function(){
		gulp.start('partials')
		// browserSync.reload();
	});
	watch('./styles/**/*.scss', function(){
		gulp.start('cssInject')
	});
});

gulp.task ('cssInject',['sass2css'], function(){
	return gulp.src('./dist/css/main.css')
	.pipe(browserSync.stream());
});

gulp.task ('htmlInject',['nunjucks'], function(){
	return gulp.src('./dist/index.html')
	.pipe(browserSync.stream());
});

gulp.task ('partials',['nunjucks'], function(){
	return gulp.src('./dist/index.html')
	.pipe(browserSync.stream());
});

gulp.task('default',['sass2css', 'scripts', 'watch', 'cssInject', 'htmlInject', 'partials', 'nunjucks']);
