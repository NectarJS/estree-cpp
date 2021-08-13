#!/usr/bin/env node
const estreecpp = require('./index')
const { createReadStream } = require('fs')
const [,, inputFile] = process.argv

if (!inputFile) {
	console.log('Usage: estree-cpp example.js\n- stdin as input: estree-cpp -\n- file as output: estree-cpp example.js > output.cpp')
	process.exit(0)
}

const chunks = []
const stream = inputFile === '-' ? process.stdin : createReadStream(inputFile)
stream.on('data', chunk => chunks.push(Buffer.from(chunk)))
stream.on('error', err => {
	console.error(err)
	process.exitCode = 1
})
stream.on('end', () => {
	const str = Buffer.concat(chunks).toString('utf8')
	console.log(estreecpp(str))
})
