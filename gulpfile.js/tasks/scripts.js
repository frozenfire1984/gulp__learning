const {src, dest} = require("gulp");
const gulpif = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const uglify = require('gulp-uglify-es').default;
const log = require("fancy-log");

const {mode} = require("../env");
const f = require("../output_format");

const scripts = () => {
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

module.exports = scripts