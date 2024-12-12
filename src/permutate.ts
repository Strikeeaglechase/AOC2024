function permutate<T>(current: T[], list: T[], idx = 0) {
	if (idx >= list.length) {
		return false;
	}

	const curVal = current[idx];
	const curValIdx = list.indexOf(curVal);
	if (curValIdx + 1 >= list.length) {
		current[idx] = list[0];
		return permutate(current, list, idx + 1);
	} else {
		current[idx] = list[curValIdx + 1];
		return true;
	}
}

export { permutate };
