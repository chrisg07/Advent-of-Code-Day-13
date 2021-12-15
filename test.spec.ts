var assert = require('assert');
const fs = require('fs')
var ProblemSolver = require('./ProblemSolver.ts')

describe('ProblemSolver', function() {

	var problemSolver;
	var lines: Array<string>

	beforeEach(function(done) {
		fs.readFile('test-input.txt', 'utf8', (err, data) => {
			if (err) {
				console.error(err)
				return
			}

			lines = data.split(/\r?\n/).map(line => line.trim());
			done()
		})
  	});
	
	it('read input', function(done) {
		problemSolver = new ProblemSolver(lines);
		assert.equal(problemSolver.instructions.length, 2)
		done()
	})

	it('solved problem', function(done) {
		problemSolver = new ProblemSolver(lines);
		assert.equal(problemSolver.answer, 17)
		done()
	})
});