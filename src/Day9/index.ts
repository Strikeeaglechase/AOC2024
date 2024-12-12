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

let time = Date.now();
let ti0 = 0;
const drive: number[] = [];
function printDrive(drive: number[]) {
	const str = drive.map(d => (d === null ? "." : d)).join("");
	return str;
}

lines[0].split("").forEach((c, idx) => {
	const size = +c;
	for (let i = 0; i < size; i++) {
		if (idx % 2 != 0) drive.push(null);
		else drive.push(idx / 2);
	}
});

for (let i = (lines[0].length - 1) / 2; i > 0; i--) {
	// const block = drive[i];
	// if (block === null) continue;

	const ti0Start = Date.now();
	const blockIdx = drive.indexOf(i);
	const blockLen = drive.filter(b => b == i).length;
	ti0 += Date.now() - ti0Start;

	// Find first open block
	let openBlockIdx = -1;
	for (let j = 0; j < drive.length; j++) {
		let allOpen = true;
		for (let check = 0; check < blockLen; check++) {
			if (drive[j + check] != null) {
				allOpen = false;
				break;
			}
		}

		if (allOpen) {
			openBlockIdx = j;
			break;
		}
	}

	if (openBlockIdx != -1 && openBlockIdx <= blockIdx) {
		for (let j = 0; j < blockLen; j++) {
			drive[openBlockIdx + j] = i;
			drive[blockIdx + j] = null;
		}
	}
}

// console.log(printDrive(drive));

let t = 0;
drive.forEach((b, idx) => {
	if (b != null) t += b * idx;
});
console.log(t);

console.log(`Execution time: ${Date.now() - time}ms`);
console.log(`Execution time for find: ${ti0}ms`);
