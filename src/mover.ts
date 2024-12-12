enum Direction {
	Up = 0,
	Right = 1,
	Down = 2,
	Left = 3,

	North = 0,
	East = 1,
	South = 2,
	West = 3
}

class Mover {
	public moverX: number = 0;
	public moverY: number = 0;
	public direction = Direction.Up;

	constructor(x: number = 0, y: number = 0, dir: Direction = Direction.Up) {
		this.moverX = x;
		this.moverY = y;
		this.direction = dir;
	}

	public directionMap: Record<Direction, { x: number; y: number }> = {
		[Direction.Up]: { x: 0, y: -1 },
		[Direction.Right]: { x: 1, y: 0 },
		[Direction.Down]: { x: 0, y: 1 },
		[Direction.Left]: { x: -1, y: 0 }
	};

	public nextPos() {
		const { x, y } = this.directionMap[this.direction];
		return { x: this.moverX + x, y: this.moverY + y };
	}

	public nextPosIsInBounds(width: number, height: number) {
		const { x, y } = this.nextPos();
		return x >= 0 && x < width && y >= 0 && y < height;
	}

	public move() {
		const { x, y } = this.directionMap[this.direction];
		this.moverX += x;
		this.moverY += y;
	}

	public turnLeft() {
		this.direction = (this.direction + 3) % 4;
	}

	public turnRight() {
		this.direction = (this.direction + 1) % 4;
	}
}

export { Mover, Direction };
