import fs from "fs";

// Boilerplate
const file = fs.readFileSync("input.txt", "utf8");
const rawLines = file.split("\r").join("").split("\n");
const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);
const numbers = lines.map(l => parseInt(l, 10));
const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
const alphaCaps = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const alphaNum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
// Boilerplate

const l1 = [];
const l2 = [];

lines.forEach(line => {
	const [a, b] = line.split("   ");
	l1.push(+a);
	l2.push(+b);
});

l1.sort((a, b) => a - b);
l2.sort((a, b) => a - b);

let t = 0;
l1.forEach((a, idx) => {
	const c = l2.filter(v => v == a).length;
	t += c * a;
});

console.log(t);
