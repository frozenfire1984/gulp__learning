const mode = process.env.NODE_ENV || "dev"
const lint_mode = process.env.LINT_ENV === "lint_enabled"

module.exports = {mode, lint_mode}