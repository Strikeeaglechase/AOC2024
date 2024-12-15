import fs from "fs";
import { Grid } from "../grid.js";

// Boilerplate
let file = fs.readFileSync("input.txt", "utf8");
file = file.replaceAll("#", "##").replaceAll(".", "..").replaceAll("O", "O.").replaceAll("@", "@.");
const rawLines = file.split("\r").join("").split("\n");
const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);
const numbers = lines.map(l => parseInt(l, 10));
const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
const alphaCaps = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const alphaNum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
// Boilerplate

const debugStatesRaw = fs.readFileSync("./out2.txt", "utf8").split("\r").join("");
const debugStates = debugStatesRaw.split("\n\n");

const nli = rawLines.indexOf("");
const grid = Grid.fromString(lines.slice(0, nli).join("\n"));
const instructions = lines.slice(nli).join("").split("");

const startNode = grid.find(n => n.value == "@");
const movers = grid.findAll(n => n.value == "O").map(n => ({ x: n.x, y: n.y }));

let x = startNode.x;
let y = startNode.y;

const iMap = {
	"^": { dx: 0, dy: -1 },
	"v": { dx: 0, dy: 1 },
	"<": { dx: -1, dy: 0 },
	">": { dx: 1, dy: 0 }
};

function print() {
	let result = "";
	const mmap: number[][] = [];
	for (let gy = 0; gy < grid.height; gy++) {
		mmap.push([]);
		for (let gx = 0; gx < grid.width; gx++) {
			mmap[gy].push(0);
		}
	}

	movers.forEach(m => {
		mmap[m.y][m.x] = 1;
		mmap[m.y][m.x + 1] = 2;
	});

	for (let gy = 0; gy < grid.height; gy++) {
		let line = "";
		for (let gx = 0; gx < grid.width; gx++) {
			const node = grid.at(gx, gy);
			// const mover = movers.find(m => m.x == gx && m.y == gy);
			// const moverOffset = movers.find(m => m.x == gx - 1 && m.y == gy);
			const mm = mmap[gy][gx];
			if (gx == x && gy == y) {
				line += "@";
			} else if (mm == 1) {
				line += "[";
			} else if (mm == 2) {
				line += "]";
			} else if (node.value == "#") {
				line += "#";
			} else {
				line += ".";
			}
		}

		result += line + "\n";
	}

	return result;
}

instructions.forEach((i, idx) => {
	const { dx, dy } = iMap[i];

	let validMove = true;

	let curCheckX = x + dx;
	let curCheckY = y + dy;

	const node = grid.at(curCheckX, curCheckY);
	if (node.value == "#") return;

	const toCheck: { x: number; y: number }[] = [];
	const wouldNeedPush: { x: number; y: number }[] = [];

	const hitMovers = movers.filter(m => (m.x == curCheckX || m.x + 1 == curCheckX) && m.y == curCheckY);
	toCheck.push(...hitMovers);

	// >[][]
	/*
	[] []   []
	[]  [] []
*/

	while (toCheck.length > 0) {
		const check = toCheck.pop();
		const checkX = check.x + dx;
		const checkY = check.y + dy;
		const nextNode = grid.at(checkX, checkY);
		const nextNodeSide = grid.at(checkX + 1, checkY);
		if (nextNode.value == "#" || nextNodeSide.value == "#") {
			validMove = false;
			break;
		}

		const wideCheck = dy != 0;
		let hitMovers: { x: number; y: number }[] = [];
		if (wideCheck) {
			hitMovers = movers.filter(m => (m.x == checkX || m.x + 1 == checkX || m.x - 1 == checkX) && m.y == checkY);
		} else {
			hitMovers = movers.filter(m => (m.x == checkX || m.x - dx == checkX) && m.y == checkY);
		}

		hitMovers.forEach(hm => {
			if (wouldNeedPush.includes(hm)) {
				console.log("Already in wouldNeedPush", idx);
			} else {
				toCheck.push(hm);
			}
		});

		wouldNeedPush.push(check);
	}

	if (validMove) {
		x += dx;
		y += dy;
		wouldNeedPush.forEach(m => {
			m.x += dx;
			m.y += dy;
		});
	}

	const ours = print().trim();
	// if (idx > 1615) {
	// 	const viewRange = 10;
	// 	const lines = ours.split("\n");
	// 	const y = lines.findIndex(l => l.includes("@"));
	// 	const x = lines[y].indexOf("@");
	// 	let oursView = "";

	// 	for (let gy = y - viewRange; gy < y + viewRange; gy++) {
	// 		let line = "";
	// 		for (let gx = x - viewRange; gx < x + viewRange; gx++) {
	// 			if (gx < 0 || gy < 0 || gx >= grid.width || gy >= grid.height) {
	// 				line += " ";
	// 			} else {
	// 				line += lines[gy][gx];
	// 			}
	// 		}

	// 		oursView += line + "\n";
	// 	}

	// 	console.log({ idx, i });
	// 	console.log(oursView);
	// }

	const debug = debugStates[idx].trim();
	if (ours != debug) {
		console.log("Mismatch", idx);
		// console.log(ours);
		// console.log(debug);

		process.exit(1);
	}
});

let t = 0;
movers.forEach(m => {
	t += m.x + m.y * 100;
});

console.log(t);

print();
