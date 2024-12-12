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

const problems: { answer: number; values: number[] }[] = [];
lines.forEach(line => {
	const [answer, rest] = line.split(": ");
	const values = rest.split(" ").map(v => +v);

	problems.push({ answer: +answer, values });
});

function evaluate(problem: { answer: number; values: number[] }, opStates: string[]) {
	let sum = problem.values[0];
	for (let i = 0; i < opStates.length; i++) {
		const op = opStates[i];
		const val = problem.values[i + 1];
		if (op === "+") {
			sum += val;
		} else if (op == "||") {
			sum *= val;
		} else {
			sum = +(sum.toString() + val.toString());
		}
	}
	return sum;
}

function incrementOpStates(opStates: string[], idx = 0) {
	if (idx >= opStates.length) {
		return;
	}

	if (opStates[idx] === "+") {
		opStates[idx] = "*";
	} else if (opStates[idx] == "*") {
		opStates[idx] = "||";
	} else {
		opStates[idx] = "+";
		incrementOpStates(opStates, idx + 1);
	}
}

let t = 0;
problems.forEach((problem, idx) => {
	const opStates = problem.values.map(v => "+").slice(0, problem.values.length - 1);
	do {
		const sum = evaluate(problem, opStates);
		if (sum === problem.answer) {
			// console.log(problem);
			t += sum;
			break;
		}
		incrementOpStates(opStates);
	} while (opStates.includes("||") || opStates.includes("*"));
});

console.log(t);
