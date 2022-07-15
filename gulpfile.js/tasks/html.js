const {src, dest} = require("gulp");
const include = require("gulp-file-include");
const replace = require("gulp-replace");
const gulpif = require("gulp-if");
const htmlhint = require("gulp-htmlhint");
const prettify = require("gulp-html-prettify");
const htmlmin = require("gulp-htmlmin");
const log = require("fancy-log");

const f = require("../output_format");
const {mode, lint_mode} = require("../env");

const fakehash = new Date().getTime()

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
			`<link href="index.min.css?fakehash=${fakehash}" type="text/css" rel="stylesheet"/>`)
	))
	.pipe(gulpif(
		mode==="prod",
		replace(
			'<script src="script.js"></script>',
			`<script src="script.min.js?fakehash=${fakehash}"></script>`)
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

module.exports = html