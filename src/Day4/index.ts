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
const grid: string[][] = lines.map(l => l.split(""));

for (let i = 0; i < grid.length - 2; i++) {
	for (let j = 0; j < grid[i].length - 2; j++) {
		// Get 3x3 grid at point
		const subGrid = [grid[i].slice(j, j + 3), grid[i + 1].slice(j, j + 3), grid[i + 2].slice(j, j + 3)];

		const patterns = [
			[
				["M", "", "S"],
				["", "A", ""],
				["M", "", "S"]
			],
			[
				["S", "", "S"],
				["", "A", ""],
				["M", "", "M"]
			],
			[
				["S", "", "M"],
				["", "A", ""],
				["S", "", "M"]
			],
			[
				["M", "", "M"],
				["", "A", ""],
				["S", "", "S"]
			]
		];

		for (const pattern of patterns) {
			let match = true;
			for (let x = 0; x < 3; x++) {
				for (let y = 0; y < 3; y++) {
					if (pattern[x][y] !== "" && pattern[x][y] !== subGrid[x][y]) {
						match = false;
					}
				}
			}

			if (match) {
				t++;
			}
		}
	}
}

console.log(t);
