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

let t = 0;
let enabled = true;
lines.forEach(line => {
	const parts = line.matchAll(/(?:mul\((\d{1,3}),(\d{1,3})\))|(?:don't\(\))|(?:do\(\))/g);
	for (const part of parts) {
		if (part[0].startsWith("do(")) enabled = true;
		else if (part[0].startsWith("don't(")) enabled = false;
		else if (enabled) t += +part[1] * +part[2];
	}
});

console.log(t);
