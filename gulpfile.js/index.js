const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso')
const htmlmin = require('gulp-htmlmin')
const include = require('gulp-file-include')
const browserSync = require('browser-sync').create()
const del = require('del')
const replace = require('gulp-replace')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel')
const rename = require('gulp-rename');
const htmlhint = require("gulp-htmlhint")
const prettify = require('gulp-html-prettify');
const log = require('fancy-log');
const order = require('gulp-order')
const imagemin = require('gulp-imagemin')
const strip = require('gulp-strip-comments');
const gulpif = require('gulp-if')
const sasslint = require('gulp-sass-lint');
const f = require('./output_format')

const mode = process.env.NODE_ENV || "dev"
const lint_mode = process.env.LINT_ENV === "lint_enabled"

let divider = ""
for (let i = 0; i < process.stdout.columns - 11; i++) {
	divider += '-'
}
log(divider)
log(`Starting with ${f.green}${f.bold}<${(mode).toUpperCase()}>${f.reset} mode`)

const lint_raw = () => {
	return src('src/**/*.html')
		.pipe(htmlhint({
			htmlhintrc: '.htmlhintrc',
		}))
		.pipe(htmlhint.reporter())
}

const html = () => {
	return src('src/*.html')
	.pipe(include({
		prefix: '@@'
	}))
	.pipe(replace('<base href="./src/"/>',''))
	.pipe(gulpif(
		mode==="prod",
		replace(
			'<link href="index.css" type="text/css" rel="stylesheet"/>',
			'<link href="index.min.css" type="text/css" rel="stylesheet"/>')
	))
	.pipe(gulpif(
		mode==="prod",
		replace(
			'<script src="script.js"></script>',
			'<script src="script.min.js"></script>')
	))
	.pipe(gulpif(lint_mode, htmlhint({
		htmlhintrc: '.htmlhintrc',
	})))
	.pipe(gulpif(lint_mode, htmlhint.reporter()))
	.pipe(gulpif(mode==="dev", prettify({
		indent_char: '	',
		indent_size: 1,
		preserve_newlines: false,
		max_preserve_newlines: 1,
	})))
	.pipe(gulpif(mode === "prod", htmlmin({
		collapseWhitespace: true,
		sortClassName: true,
		keepClosingSlash: true,
		removeComments: true,
	})))
	.pipe(dest('dist'))
	.on('finish', () => {
		log(`${f.bold}${f.reverse} HTML ${f.reset} compiled${mode === "prod" ? ", compressed" : ""} and copied!`)
	});
}

const scss = () => {
	return src('src/styles/**/*.scss')
		.pipe(gulpif(lint_mode, sasslint({
			configFile: 'sasslintconfig.yml',
		})))
		.pipe(gulpif(lint_mode, sasslint.format()))
		.pipe(gulpif(lint_mode, sasslint.failOnError()))
		.pipe(gulpif(mode === "dev", sourcemaps.init()))
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(gulpif(mode==="prod", autoprefixer({
			cascade: true,
			grid: 'no-autoplace',
		})))
		.pipe(src('src/styles/fonts.css'))
		.pipe(order([
			'src/styles/**/*.css',
			'src/styles/**/*.scss',
		]))
		.pipe(gulpif(mode === "dev", sourcemaps.init()))
		.pipe(concat(`index${mode === "prod" ? ".min" : ""}.css`))
		.pipe(replace('url(../','url('))
		.pipe(replace('url(\'../','url(\''))
		.pipe(gulpif(mode === "prod", csso({
			restructure: false,
			sourceMap: true,
			//debug: true
		})))
	.pipe(gulpif(mode === "dev", sourcemaps.write('.')))
		.pipe(dest('dist'))
		.on('finish', () => {
			log(`${f.bold}${f.reverse} SCSS ${f.reset} compiled${mode === "prod" ? ", compressed" : ""} and copied!`)
		});
}

const js = () => {
	return src([
		//'node_modules/jquery/dist/jquery.js',
		'src/js/**/*.js'
	])
		.pipe(gulpif(mode==="dev", sourcemaps.init()))
		.pipe(concat(`script${mode === "prod" ? ".min" : ""}.js`))
		.pipe(gulpif(mode==="prod", uglify({
			mangle: {
				toplevel: true,
			},
			compress: {
				drop_console: true,
			},
			output: {
				beautify: false,
				comments: false,
				preamble: `/* Date: ${new Date()} */`
			}
		})))
		.pipe(gulpif(mode==="dev", sourcemaps.write('.')))
		.pipe(dest('dist'))
		.on('finish', () => {
			log(`${f.bold}${f.reverse} JAVASCRIPT ${f.reset} joined${mode === "prod" ? ", compressed" : ""} and copied!`)
		});
}

const fonts = () => {
	return src(['src/fonts/**/*.*'],{base: 'src'})
		.pipe(dest('dist'))
		.on('finish', () => {
			log(`${f.bold}${f.reverse} FONTS ${f.reset} copied!`)
		});
}

const images = () => {
	return src(['src/images/**/*.*'], {base: 'src'})
		.pipe(gulpif(mode==="prod", imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: false},
					{cleanupIDs: false}
				]
			})
		])))
		.pipe(dest('dist'))
		.on('finish', () => {
			log(`${f.bold}${f.reverse} IMAGES ${f.reset} ${mode === "prod" ? "compressed and" : ""} copied!`)
		});
}

const clear = () => {
	return del('dist')
}

const serve = () => {
	browserSync.init({
		server: './dist'
	})
	
	watch('src/**/*.html', series(html)).on('change', browserSync.reload)
	watch('src/styles/**/*.scss', series(scss)).on('change', browserSync.reload)
	watch('src/js/**/*.js', series(js)).on('change', browserSync.reload)
}

exports.html = html
exports.scss = scss
exports.clear = clear
exports.js = js
exports.fonts = fonts
exports.images = images
exports.lint_raw = lint_raw
exports.serve = series(clear, scss, html, js, serve)
exports.build = series(clear, fonts, images, scss, html, js)

