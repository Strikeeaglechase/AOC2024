import fs from "fs";

import { Grid, GridNode } from "../grid.js";
import { Direction, Mover } from "../mover.js";

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

	const edgeNodes: GridNode<string>[] = [];

	region.forEach(node => {
		const nabs = [
			{ node: region.find(n => n.x == node.x && n.y == node.y - 1), type: "horiz" },
			{ node: region.find(n => n.x == node.x && n.y == node.y + 1), type: "horiz" },
			{ node: region.find(n => n.x == node.x - 1 && n.y == node.y), type: "vert" },
			{ node: region.find(n => n.x == node.x + 1 && n.y == node.y), type: "vert" }
		];

		if (nabs.some(n => !n.node)) {
			edgeNodes.push(node);
		}

		// nabs.forEach(n => {
		// 	if (n.node) return;

		// });
	});

	if (edgeNodes.length == 1) {
		perimeter = 4;
	} else {
		// let curNode = edgeNodes[0];
		const curPos = new Mover(edgeNodes[0].x, edgeNodes[0].y, Direction.Up);
		const handledNodes: GridNode<string>[] = [edgeNodes[0]];

		let dirsHandled: Record<Direction, boolean> = {
			[Direction.Up]: false,
			[Direction.Right]: false,
			[Direction.Down]: false,
			[Direction.Left]: false
		};
		let dirLastMoved = Direction.Up;

		let i = 0;
		while (i < 10) {
			const { x, y } = curPos.nextPos();
			const nextNode = edgeNodes.find(n => n.x == x && n.y == y);
			console.log(`Checking ${x}, ${y}`);
			if (!nextNode) {
				// Next spot is empty, must be perimeter
				const handled = dirsHandled[curPos.direction];
				console.log(`No next node ${Direction[curPos.direction]}, handled: ${handled}`);
				if (!handled) perimeter++;
				dirsHandled[curPos.direction] = true;
				curPos.turnLeft();
				continue;
			}

			if (handledNodes.length == edgeNodes.length) {
				// Did a full loop
				break;
			}

			if (handledNodes.includes(nextNode)) {
				// Already handled node, ignore
				curPos.turnLeft();
				console.log(`Already handled`);
				continue;
			}

			handledNodes.push(nextNode);
			curPos.move();

			// Once moved, reset handled dirs for the opposite axis
			if (curPos.direction == Direction.Up || curPos.direction == Direction.Down) {
				dirsHandled[Direction.Up] = false;
				dirsHandled[Direction.Down] = false;
				console.log(`Resetting up and down`);
			}
			if (curPos.direction == Direction.Left || curPos.direction == Direction.Right) {
				dirsHandled[Direction.Left] = false;
				dirsHandled[Direction.Right] = false;
				console.log(`Resetting left and right`);
			}

			// if (curPos.direction != dirLastMoved) {
			// 	// dirsHandled = {
			// 	// 	[Direction.Up]: false,
			// 	// 	[Direction.Right]: false,
			// 	// 	[Direction.Down]: false,
			// 	// 	[Direction.Left]: false
			// 	// };
			// 	dirLastMoved = curPos.direction;
			// }
		}
	}

	console.log(`Region ${region[0].value} has perimeter ${perimeter} and area ${region.length}`);

	t += perimeter * region.length;
});

console.log(t);
