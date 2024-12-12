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

let stones = lines[0].split(" ").map(n => ({ value: +n, binCount: 1 }));

for (let i = 0; i < 5; i++) {
	for (let j = 0; j < stones.length; j++) {
		const s = stones[j];
		if (s.value == 0) s.value = 1;
		else if (s.value.toString().length % 2 == 0) {
			const str = s.value.toString();
			const len = str.length;
			const left = str.slice(0, len / 2);
			const right = str.slice(len / 2);
			s.value = +left;
			stones.splice(j + 1, 0, { value: +right, binCount: s.binCount });
			j++; // Skip the next one
		} else {
			s.value *= 2024;
		}
	}

	// console.log(stones);

	if (false) {
		const newStones: { value: number; binCount: number }[] = [];
		for (let j = 0; j < stones.length; j++) {
			const s = stones[j];
			if (newStones.some(ns => ns.value == s.value)) {
				const existing = newStones.find(ns => ns.value == s.value);
				existing.binCount += s.binCount;
			} else {
				newStones.push(s);
			}
		}
		stones = newStones;
	}

	console.log(stones.map(s => s.value).join(" "));
}

let t = 0;
stones.forEach(s => {
	t += s.binCount;
});

console.log(t);
