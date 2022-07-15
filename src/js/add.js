/*
function func() {
	console.log("func");
}

export {func}*/

const func = () => {
	const body = document.getElementsByTagName("body")[0]
	let count = 0
	body.addEventListener("click", () => {
		count++
		console.log(count)
	})
}

func()


