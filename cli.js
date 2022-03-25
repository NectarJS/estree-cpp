import estreecpp from './index.js'
import { once } from 'events'
import { createReadStream, createWriteStream } from 'fs'
const [,, inputFile, outputFile] = process.argv

if (!inputFile) {
  console.log('Usage: estree-cpp <input> [output]\n  Takes JS script from file or stdin and outputs C++ code to file or stdout')
  process.exit(0)
}

async function readFullStream (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

async function outputFullStream (stream, data) {
  for (let i = 0; i < data.length;) {
    const flushed = stream.write(data.slice(i, i += stream.writableHighWaterMark))
    if (!flushed) {
      await once(stream, 'drain')
    }
  }
  stream.end()
}

async function main () {
  const inputStream = inputFile === '-' ? process.stdin : createReadStream(inputFile)
  const inputBuffer = await readFullStream(inputStream)
  const outputStream = !outputFile || outputFile === '-' ? process.stdout : createWriteStream(outputFile)
  await outputFullStream(outputStream, estreecpp(inputBuffer.toString('utf-8')))
}
main()
