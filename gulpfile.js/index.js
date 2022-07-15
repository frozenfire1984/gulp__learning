const {src, dest, series, watch} = require('gulp')
const browserSync = require('browser-sync').create()
const gulpif = require("gulp-if");
const gs  = require('gulp-obfuscate-selectors');
const {mode} = require("./env");

const html = require('./tasks/html')
const scss = require('./tasks/scss')
const scripts = require('./tasks/scripts')
const images = require('./tasks/images')
const fonts = require('./tasks/fonts')
const f = require('./output_format')

const {start_msg, clear} = require('./tasks/utils')
const log = require("fancy-log");
start_msg()

const obf = () => {
	return src(['dist/*.html', 'dist/*.css'])
		.pipe(gulpif(mode === "prod", gs.run({},{
			classes: ['hidden', 'active', 'click'],
			ids: '*'
		})))
		.pipe(gulpif(mode === "prod", dest('dist').on('finish', () => {
			log(`${f.bold}${f.reverse} HTML and CSS ${f.reset} obfuscated!`)
		})))
}

const serve = () => {
	browserSync.init({
		server: './dist'
	})
	
	watch('src/**/*.html', series(html)).on('change', browserSync.reload)
	watch('src/styles/**/*.scss', series(scss)).on('change', browserSync.reload)
	watch('src/js/**/*.js', series(scripts)).on('change', browserSync.reload)
}

exports.obf = obf
exports.serve = series(clear, fonts, images, scss, html, scripts, serve)
exports.build = series(clear, fonts, images, scss, html, scripts, obf)

