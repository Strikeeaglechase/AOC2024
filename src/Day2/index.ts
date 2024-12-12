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
lines.forEach(l => {
	const nums = l.split(" ").map(n => +n);

	// let testRemoveIdx = -1;

	let someValid = false;
	for (let testRemoveIdx = -1; testRemoveIdx < nums.length; testRemoveIdx++) {
		let idx0 = testRemoveIdx == 0 ? 1 : 0;
		const idx1 = idx0 + 1 == testRemoveIdx ? idx0 + 2 : idx0 + 1;
		const fD = nums[idx0] - nums[idx1];

		let valid = true;
		for (let i = 0; i < nums.length - 1; i++) {
			if (testRemoveIdx == i) continue;
			const nextIdx = i + 1 == testRemoveIdx ? i + 2 : i + 1;
			if (nextIdx >= nums.length) continue;

			const delta = Math.abs(nums[i] - nums[nextIdx]);
			if (delta > 3 || delta < 1) valid = false;
			if (Math.sign(nums[i] - nums[nextIdx]) != Math.sign(fD)) valid = false;
		}

		if (valid) {
			someValid = true;
			break;
		}
	}

	// console.log(someValid);
	if (someValid) t++;
});

console.log(t);
