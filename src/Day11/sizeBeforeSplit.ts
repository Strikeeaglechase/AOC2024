function findSplitIters(start: number) {
	let t = 0;
	while (start.toString().length % 2 != 0) {
		start *= 2024;
		t++;
	}

	return t;
}

const digitCat: Record<number, { bestVal: number; bestIdx: number }> = {};
for (let i = 1; i < 1e12; i++) {
	const iters = findSplitIters(i);
	const cat = i.toString().length;
	console.log({ cat, i, iters });
	const { bestVal, bestIdx } = digitCat[cat] || { bestVal: 0, bestIdx: 0 };

	if (iters > bestVal) {
		digitCat[cat] = { bestVal: iters, bestIdx: i };
		console.log(`New best for ${cat}: ${bestIdx} -> ${bestVal}`);
	}
}
