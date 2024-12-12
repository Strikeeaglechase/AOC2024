import fs from "fs";

import { Grid, GridNode } from "../grid.js";

// Boilerplate
const file = fs.readFileSync("input.txt", "utf8");
const rawLines = file.split("\r").join("").split("\n");
const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);
const numbers = lines.map(l => parseInt(l, 10));
const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
const alphaCaps = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const alphaNum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
// Boilerplate

const grid = Grid.numberGridFromString(file);

const starts = grid.findAll(n => n.value == 0);

let t = 0;
starts.forEach(startNode => {
	let current = [startNode];

	const reachedNines: GridNode<number>[] = [];
	let paths = 0;
	while (current.length > 0) {
		const newNodes = [];
		current.forEach(node => {
			const ops = [grid.at(node.x, node.y - 1), grid.at(node.x + 1, node.y), grid.at(node.x - 1, node.y), grid.at(node.x, node.y + 1)];
			ops.forEach(nab => {
				if (!nab) return;

				if (nab.value == node.value + 1 && nab.value == 9) {
					if (!reachedNines.includes(nab)) {
						reachedNines.push(nab);
					}
					paths++;
					return;
				}

				if (nab.value == node.value + 1) {
					newNodes.push(nab);
				}
			});
		});

		current = newNodes;
	}

	// console.log(paths);

	t += paths;
});

console.log(t);
