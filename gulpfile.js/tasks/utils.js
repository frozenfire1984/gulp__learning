const {src, watch, series} = require("gulp");
const log = require("fancy-log");
const htmlhint = require("gulp-htmlhint");
const del = require("del");

const f = require("../output_format");
const {mode} = require("../env");

const start_msg = () => {
	let divider = ""
	for (let i = 0; i < process.stdout.columns - 11; i++) {
		divider += '-'
	}
	log(divider)
	log(`Starting with ${f.green}${f.bold}<${(mode).toUpperCase()}>${f.reset} mode`)
}

const lint_raw = () => {
	return src('src/**/*.html')
	.pipe(htmlhint({
		htmlhintrc: '.htmlhintrc',
	}))
	.pipe(htmlhint.reporter())
}

const clear = () => {
	return del('dist')
}

module.exports = {start_msg, lint_raw, clear}