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

let rules: { page: number; requiresAfter: number }[] = [];
let i;
for (i = 0; i < rawLines.length; i++) {
	if (rawLines[i].trim() == "") break;

	const parts = rawLines[i].split("|");
	rules.push({
		page: +parts[0],
		requiresAfter: +parts[1]
	});
}

let t = 0;

const invalidLists: number[][] = [];

function correctlyOrdered(list: number[]) {
	let valid = true;
	let invalidOn = -1;

	list.forEach((page, idx) => {
		if (!valid) return;
		const pagesAfter = list.slice(idx + 1);
		const requires = rules.filter(r => r.page == +page);
		const anyBreaks = requires.some(r => {
			return list.includes(r.requiresAfter) && !pagesAfter.includes(r.requiresAfter);
		});

		if (anyBreaks) {
			valid = false;
			invalidOn = idx;
		}
	});

	return { valid, invalidOn };
}

for (i++; i < rawLines.length; i++) {
	const list = rawLines[i].split(",").map(v => +v);
	let valid = true;

	list.forEach((page, idx) => {
		const pagesAfter = list.slice(idx + 1);
		const requires = rules.filter(r => r.page == +page);
		const anyBreaks = requires.some(r => {
			return list.includes(r.requiresAfter) && !pagesAfter.includes(r.requiresAfter);
		});

		if (anyBreaks) {
			valid = false;
		}
	});

	if (valid) {
		const mid = list[(list.length - 1) / 2];
		t += mid;
	} else {
		invalidLists.push(list);
	}
}

// console.log(t);

function swap(arr: number[], a: number, b: number) {
	const temp = arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
}

let start = Date.now();
let t2 = 0;
invalidLists.forEach(list => {
	while (true) {
		const { valid, invalidOn } = correctlyOrdered(list);
		if (valid) {
			// console.log(list);
			const mid = list[(list.length - 1) / 2];
			t2 += mid;
			break;
		}

		swap(list, invalidOn, invalidOn - 1);
	}
});

console.log(t2);

console.log("Took", Date.now() - start, "ms");
