const {src, dest} = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const gulpif = require("gulp-if");
const sasslint = require("gulp-sass-lint");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const order = require("gulp-order");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const csso = require("gulp-csso");
const log = require("fancy-log");

const f = require("../output_format");
const {lint_mode, mode} = require("../env");

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
	.pipe(replace('url(\"../','url(\"'))
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

module.exports = scss