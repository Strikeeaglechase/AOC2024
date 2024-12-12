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

// const obs: { x: number; y: number }[] = [];
const obs: Set<string> = new Set();
let startX = 0;
let startY = 0;

lines.forEach((l, y) => {
	l.split("").forEach((v, x) => {
		if (v == "#") obs.add(`${x},${y}`);
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

function doesLoop(extraObs: string) {
	const visited: Set<string> = new Set();
	const visitedNoDir: Set<string> = new Set();
	let dir = 0;
	let curX = startX;
	let curY = startY;
	while (true) {
		const nextX = curX + dirs[dir].x;
		const nextY = curY + dirs[dir].y;
		if (nextX < 0 || nextY < 0 || nextX >= lines[0].length || nextY >= lines.length) {
			break;
		}

		// const obstic = obs.find(o => o.x == nextPos.x && o.y == nextPos.y);
		const nextPosRawStr = `${nextX},${nextY}`;
		if (extraObs == nextPosRawStr || obs.has(nextPosRawStr)) {
			dir = (dir + 1) % 4;
			continue;
		}

		const nextPosStr = `${nextX},${nextY},${dir}`;
		if (visited.has(nextPosStr)) {
			return { loops: true, visited: visitedNoDir };
		}

		visited.add(nextPosStr);
		visitedNoDir.add(nextPosRawStr);
		curX = nextX;
		curY = nextY;
	}

	return { loops: false, visited: visitedNoDir };
}

const basePath = doesLoop(null).visited;
let count = 0;
let startTime = Date.now();
basePath.forEach(pt => {
	if (doesLoop(pt).loops) count++;
});

console.log(Date.now() - startTime);
console.log(count);
