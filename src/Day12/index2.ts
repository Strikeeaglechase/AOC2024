import fs from "fs";

import { Grid, GridNode } from "../grid.js";
import { Direction } from "../mover.js";

let dt = Date.now();

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
const regions: GridNode<string>[][] = [];
const processedNodes: GridNode<string>[] = [];

function floodFill(node: GridNode<string>, region: GridNode<string>[]) {
	if (processedNodes.includes(node)) return;
	processedNodes.push(node);
	region.push(node);

	const horizontalOrVerticalNabs = [grid.at(node.x + 1, node.y), grid.at(node.x - 1, node.y), grid.at(node.x, node.y + 1), grid.at(node.x, node.y - 1)].filter(
		n => !!n
	);

	horizontalOrVerticalNabs.forEach(n => {
		if (n.value == node.value) floodFill(n, region);
	});
}

grid.scan(node => {
	if (processedNodes.includes(node)) return;
	const region: GridNode<string>[] = [];
	floodFill(node, region);
	regions.push(region);
});

let t = 0;
regions.forEach(region => {
	let perimeter = 0;

	const edgeNodes: { node: GridNode<string>; dirs: Direction[] }[] = [];

	region.forEach(node => {
		const nabs = [
			{ node: region.find(n => n.x == node.x && n.y == node.y - 1), dir: Direction.Up },
			{ node: region.find(n => n.x == node.x && n.y == node.y + 1), dir: Direction.Down },
			{ node: region.find(n => n.x == node.x - 1 && n.y == node.y), dir: Direction.Left },
			{ node: region.find(n => n.x == node.x + 1 && n.y == node.y), dir: Direction.Right }
		];

		if (nabs.some(n => !n.node)) {
			edgeNodes.push({ node, dirs: nabs.filter(n => !n.node).map(n => n.dir) });
		}
	});

	const horizWalls: { y: number; xStart: number; xEnd: number; dir: Direction }[] = [];
	const handledHorizNodes: Set<string> = new Set();

	edgeNodes.forEach(({ node, dirs }) => {
		dirs.forEach(dir => {
			const nodeKey = `${node.x},${node.y},${dir}`;
			if (handledHorizNodes.has(nodeKey)) return;
			if (dir != Direction.Up && dir != Direction.Down) return;

			const wall = { y: node.y, xStart: node.x, xEnd: node.x, dir };
			while (true) {
				// Try to extend the wall left or right
				const left = edgeNodes.find(n => n.node.x == wall.xStart - 1 && n.node.y == wall.y && n.dirs.includes(dir));
				const right = edgeNodes.find(n => n.node.x == wall.xEnd + 1 && n.node.y == wall.y && n.dirs.includes(dir));
				if (left) {
					wall.xStart = left.node.x;
					handledHorizNodes.add(`${left.node.x},${left.node.y},${dir}`);
				}

				if (right) {
					wall.xEnd = right.node.x;
					handledHorizNodes.add(`${right.node.x},${right.node.y},${dir}`);
				}

				if (!left && !right) break;
			}

			horizWalls.push(wall);
		});
	});

	const vertWalls: { x: number; yStart: number; yEnd: number; dir: Direction }[] = [];
	const handledVertNodes: Set<string> = new Set();

	edgeNodes.forEach(({ node, dirs }) => {
		dirs.forEach(dir => {
			const nodeKey = `${node.x},${node.y},${dir}`;
			if (handledVertNodes.has(nodeKey)) return;
			if (dir != Direction.Left && dir != Direction.Right) return;

			const wall = { x: node.x, yStart: node.y, yEnd: node.y, dir };
			while (true) {
				const up = edgeNodes.find(n => n.node.x == wall.x && n.node.y == wall.yStart - 1 && n.dirs.includes(dir));
				const down = edgeNodes.find(n => n.node.x == wall.x && n.node.y == wall.yEnd + 1 && n.dirs.includes(dir));
				if (up) {
					wall.yStart = up.node.y;
					handledVertNodes.add(`${up.node.x},${up.node.y},${dir}`);
				}

				if (down) {
					wall.yEnd = down.node.y;
					handledVertNodes.add(`${down.node.x},${down.node.y},${dir}`);
				}

				if (!up && !down) break;
			}

			vertWalls.push(wall);
		});
	});

	const tperimeter = vertWalls.length + horizWalls.length;

	t += tperimeter * region.length;
	console.log(`Region ${region[0].value} has perimeter ${tperimeter} - ${tperimeter * region.length} ${t}`);
});

console.log(t);

console.log(`Elapsed time: ${Date.now() - dt}ms`);
