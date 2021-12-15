module.exports = class ProblemSolver {
	answer = 0
	instructions = new Array<{axis: string, index: number}>()
	dots = new Array<{x: number, y: number}>()
	paper = new Array<Array<string>>()
	width: number
	height: number

	constructor(lines: Array<string>) {
		for (let [index, entry] of lines.entries()) {
			if (entry) {
				// row of input
				if (entry.includes(',')) {
					const coords = entry.split(',').map(index => Number(index))
					this.dots.push({x: coords[0], y: coords[1]})
				} else {
					const equalsIndex = entry.indexOf('=')
					const instruction = entry.substring(equalsIndex - 1).split('=')
					this.instructions.push({axis: instruction[0], index: Number(instruction[1])})
				}
			}
		}
		this.paper = this.createPaper(this.dots)
		this.width = this.paper[0].length
		this.height = this.paper.length
		for (let [index, instruction] of this.instructions.entries()) {
			this.paper = this.foldPaper(instruction.axis, instruction.index)
			if (index === 0) {
				this.answer = this.getAnswer()
			}
		}
  	}

	getAnswer(): number {
		const foldedPaperRegion = this.filterDots(this.dots, 0, this.width, 0, this.height)

		const uniqueDots = new Set(foldedPaperRegion.map(point => JSON.stringify(point)))
		console.log(uniqueDots)
		return uniqueDots.size
	}

	foldPaper(axis: string, index: number): Array<Array<string>> {
		const foldedPaper = new Array<Array<string>>()
		if (axis === 'x') {
			const rightSideDots = this.filterDots(this.dots, index, this.width, 0, this.height)
			const shiftedDots = rightSideDots.map(dot => {
				const delta = dot.x - index
				return {x: index - delta, y: dot.y}
			})
			this.dots.push(...shiftedDots)
			this.width = index
		} else {
			const bottomSideDots = this.filterDots(this.dots, 0, this.width, index, this.height)
			const shiftedDots = bottomSideDots.map(dot => {
				const delta = dot.y - index
				return {x: dot.x, y: index - delta}
			})
			this.dots.push(...shiftedDots)
			this.height = index
		}
		
		return foldedPaper
	}

	filterDots(dots: Array<{x: number, y: number}>, minX: number, maxX: number, minY: number, maxY: number): Array<{x: number, y: number}> {
		return dots.filter(dot => dot.x >= minX && dot.x <= maxX && dot.y >= minY && dot.y <= maxY)
	}

	createPaper(dots: Array<{x: number, y: number}>): Array<Array<string>> {
		const maxX = Math.max(...dots.map(dot => dot.x))
		const maxY = Math.max(...dots.map(dot => dot.y))
		console.log('max x:y => ', maxX, maxY)
		let markedPaper = new Array<Array<string>>()
		for (let y = 0; y <= maxY; y++) {
			let row = new Array<string>()
			for (let x = 0; x <= maxX; x++) {
				row.push('.')
			}
			markedPaper.push(row)
		}
		for (const dot of dots) {
			markedPaper[dot.y][dot.x] = '#'
		}
		return markedPaper
	}

	countDots(paper: Array<Array<string>>): number {
		let numDots = 0
		paper.forEach(x => x.forEach(y => y === '#' ? numDots++ : undefined))
		return numDots
	}
}