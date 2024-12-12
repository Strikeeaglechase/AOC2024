import fs from "fs";

import { Grid } from "../grid.js";

// Boilerplate
const file = fs.readFileSync("input.txt", "utf8");
const rawLines = file.split("\r").join("").split("\n");
const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);
const numbers = lines.map(l => parseInt(l, 10));
const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
const alphaCaps = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const alphaNum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
// Boilerplate

const grid = Grid.fromString(file);
const freqs = new Set<string>();
grid.scan(n => {
	if (n.value != ".") freqs.add(n.value);
});

const anodes = new Set<string>();

[...freqs].forEach(freq => {
	const antenna = grid.findAll(n => n.value == freq);

	for (let i = 0; i < antenna.length; i++) {
		const a = antenna[i];
		for (let j = 0; j < antenna.length; j++) {
			if (i == j) continue;
			const b = antenna[j];

			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const anodePt = { x: a.x + dx, y: a.y + dy };
			while (grid.inBounds(anodePt.x, anodePt.y)) {
				const anodeStr = `${anodePt.x},${anodePt.y}`;
				if (!anodes.has(anodeStr)) {
					anodes.add(anodeStr);
				}

				anodePt.x += dx;
				anodePt.y += dy;
			}
		}
	}
});

console.log(anodes.size);
