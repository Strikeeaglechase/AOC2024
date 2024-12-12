interface GridNode<T> {
	x: number;
	y: number;
	value: T;

	neighbors: GridNode<T>[];
	alinedNeighbors: GridNode<T>[];
}

type ScanFn<T, R> = (node: GridNode<T>, x: number, y: number, isEndOfLine: boolean) => R;

class Grid<T = string> {
	public grid: GridNode<T>[][] = [];
	public elements: GridNode<T>[] = [];

	public width: number = 0;
	public height: number = 0;

	constructor(public rawGrid: T[][]) {
		this.processGrid();
		this.setupNeighbors();
	}

	private processGrid() {
		this.rawGrid.forEach((row, y) => {
			this.grid[y] = [];
			row.forEach((value, x) => {
				this.grid[y][x] = { x, y, value, neighbors: [], alinedNeighbors: [] };
			});
		});

		this.width = this.grid[0].length;
		this.height = this.grid.length;
	}

	private setupNeighbors() {
		this.grid.forEach((row, y) => {
			row.forEach((node, x) => {
				const r = this.getNeighbors(x, y);
				node.neighbors = r.neighbors;
				node.alinedNeighbors = r.alinedNeighbors;
				this.elements.push(node);
			});
		});
	}

	public getNeighbors(x: number, y: number) {
		const neighbors: GridNode<T>[] = [];
		const alinedNeighbors: GridNode<T>[] = [];

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue;

				const neighborX = x + j;
				const neighborY = y + i;

				if (neighborX >= 0 && neighborX < this.width && neighborY >= 0 && neighborY < this.height) {
					neighbors.push(this.grid[neighborY][neighborX]);
					alinedNeighbors.push(this.grid[neighborY][neighborX]);
				} else {
					alinedNeighbors.push(null);
				}
			}
		}

		return { neighbors, alinedNeighbors };
	}

	public inBounds(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	public at(x: number, y: number): GridNode<T> {
		if (!this.inBounds(x, y)) return null;
		return this.grid[y][x];
	}

	public atCurrent(x: number, y: number): GridNode<T> {
		const node = this.find(n => n.x === x && n.y === y);
		return node;
	}

	public scan(fn: ScanFn<T, void>) {
		this.grid.forEach((row, y) => {
			row.forEach((node, x) => {
				const isEndOfLine = x === this.width - 1;
				fn(node, x, y, isEndOfLine);
			});
		});
	}

	public find(fn: ScanFn<T, boolean>): GridNode<T> | undefined {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const node = this.grid[y][x];
				const isEndOfLine = x === this.width - 1;
				if (fn(node, x, y, isEndOfLine)) return node;
			}
		}
	}

	public findAll(fn: ScanFn<T, boolean>): GridNode<T>[] {
		const nodes: GridNode<T>[] = [];

		this.scan((node, x, y, isEndOfLine) => {
			if (fn(node, x, y, isEndOfLine)) nodes.push(node);
		});

		return nodes;
	}

	public print(printFn: (node: GridNode<T>) => string = n => n.value.toString()) {
		let str = "";

		this.grid.forEach(row => {
			row.forEach(node => {
				str += printFn(node);
			});

			str += "\n";
		});

		return str;
	}

	public static fromString(str: string): Grid<string> {
		const lines = str.replaceAll("\r", "").split("\n");
		const rawGrid = lines.map(line => line.split(""));

		return new Grid(rawGrid);
	}

	public static numberGridFromString(str: string): Grid<number> {
		const lines = str.replaceAll("\r", "").split("\n");
		const rawGrid = lines.map(line => line.split("").map(char => parseInt(char, 10)));

		return new Grid(rawGrid);
	}
}

export { Grid, GridNode };
