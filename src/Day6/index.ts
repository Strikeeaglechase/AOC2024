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

const obs: { x: number; y: number }[] = [];
let startX = 0;
let startY = 0;

lines.forEach((l, y) => {
	l.split("").forEach((v, x) => {
		if (v == "#") obs.push({ x, y });
		if (v == "^") {
			startX = x;
			startY = y;
		}
	});
});

const dirs = [
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 }
];

function doesLoop(obs: { x: number; y: number }[]) {
	const visited: Set<string> = new Set();
	let dir = 0;
	let curX = startX;
	let curY = startY;
	while (true) {
		const nextPos = { x: curX + dirs[dir].x, y: curY + dirs[dir].y };
		if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= lines[0].length || nextPos.y >= lines.length) {
			break;
		}

		const obstic = obs.find(o => o.x == nextPos.x && o.y == nextPos.y);
		if (obstic) {
			dir = (dir + 1) % 4;
			continue;
		}

		const nextPosStr = `${nextPos.x},${nextPos.y},${dir}`;
		if (visited.has(nextPosStr)) {
			return true;
		}

		visited.add(nextPosStr);
		curX = nextPos.x;
		curY = nextPos.y;
	}

	return false;
}

const width = lines[0].length;
const height = lines.length;
let count = 0;
let startTime = Date.now();
for (let i = 0; i < height; i++) {
	console.log(i);
	for (let j = 0; j < width; j++) {
		const newObs = [...obs, { x: j, y: i }];
		if (doesLoop(newObs)) {
			count++;
		}
	}
}

console.log(Date.now() - startTime);
console.log(count);
