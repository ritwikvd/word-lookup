const fs = require("fs");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const mongo = require("./config/mongo");

const Word = require("./models/Word");
const { addAudioFile, getWordObject } = require("./controllers/words");

//Start
fs.readFile(`./words.txt`, `utf8`, importWords);

process.on("unhandledRejection", error => {
	console.log(`Unhandled rejection: ${error}`);
	process.exit(1);
});

function importWords(err, data) {
	data = data.trim();

	const arr = data.split("\r\n");

	startLoad(arr);
}

async function startLoad(arr) {
	await mongo();

	let results = [];

	if (!(process.env.APP_ID && process.env.APP_KEY)) throw new Error("config variables undefined ", process.env.APP_ID, process.env.APP_KEY);

	const config = {
		headers: {
			app_id: process.env.APP_ID,
			app_key: process.env.APP_KEY
		}
	};

	let iterator = arr[Symbol.iterator]();

	let result = iterator.next();

	let stop;

	do {
		const resolved = await axios.get(`https://od-api.oxforddictionaries.com/api/v2/entries/en/${result.value}`, config);

		results.push(resolved);

		console.log("pushed result of ", result.value, Date.now(), result.done);

		if (!result.done) await new Promise(resolve => setTimeout(resolve, 2 * 1000));

		let next = iterator.next();

		stop = result.done;

		if (next) result = next;
	} while (!stop);

	console.log("url request done");

	await Promise.all(
		results.map(({ data }) => {
			const { word } = data;

			const result = getWordObject(word, data.results[0].lexicalEntries);

			addAudioFile(word, result.audioFile);

			return Word.create(result);
		})
	);

	console.log("All words added to MongoDB");

	process.exit(0);
}
