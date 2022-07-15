//import {func} from "./add.js";

//console.log("foo")
//func()

const a = "a"
const b = "b"
const c = "c"
const d = "d"
const e = "e"

const sect = document.querySelectorAll('section')
const div_tag = document.createElement("div")

const rand = Math.floor(Math.random() * 10)

if (rand > 5) {
	div_tag.innerHTML = "foo bar"
} else {
	div_tag.innerHTML = "lorem ipsum"
}

console.log(div_tag)

sect.forEach((i) => {
	const clone_div_tag = div_tag.cloneNode(true)
	i.appendChild(div_tag.cloneNode(true))
	//i.append(document.createElement("div").innerHTML = "foo bar")
	console.log(i)
})

const cl = document.querySelector(".click")
console.log(cl)
cl.addEventListener("click", (e) => {
	e.preventDefault()
	alert("click")
})

