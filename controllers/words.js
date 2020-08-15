const fs = require("fs");
const axios = require("axios");
const path = require("path");

const Word = require("../models/Word");
const { returnSenseSchema } = require("../models/Sense");
const handler = require("../middleware/catchHandler");

// @desc Get all words
// @route GET /api/v1/words/
// @access Public
const getWords = async (req, res, next) => {
	const data = await Word.find();

	// const allWords = data.map(a => a.word).join("\r\n");
	// fs.writeFile("./words.txt", allWords, e => {
	// 	console.log(e);
	// });

	res.status(200).json({ success: true, count: data.length, data });
};

exports.getWords = handler(getWords);

// @desc Add a word
// @route POST /api/v1/words/:word
// @access Public
const addWord = async (req, res, next) => {
	const word = req.params.word;

	const config = {
		headers: {
			app_id: process.env.APP_ID,
			app_key: process.env.APP_KEY
		}
	};

	const { data } = await axios.get(`${process.env.API_URL}/${word}`, config);

	//insert into mongo
	const result = await Word.create(getWordObject(word, data.results[0].lexicalEntries));
	//

	addAudioFile(word, result.audioFile);

	res.status(200).json({ success: true, result });
};

exports.addWord = handler(addWord);

// @desc Get a word
// @route GET /api/v1/words/:word
// @access Public
const getWord = async (req, res, next) => {
	const data = await Word.find({ word: req.params.word });

	if (!data.length) return res.status(404).json({ success: false });

	res.status(200).json({ success: true, count: data.length, data });
};

exports.getWord = handler(getWord);

// @desc Delete a word
// @route DEL /api/v1/words/:word
// @access Public
const deleteWord = async (req, res, next) => {
	const word = req.params.word;

	const result = await Word.findOneAndDelete({ word });

	const route = path.resolve(`./audio-uploads/${word}.mp3`);

	fs.existsSync(route) && fs.unlinkSync(route);

	res.status(200).json({ success: true, data: result });
};

exports.deleteWord = handler(deleteWord);

//Utility functions
async function addAudioFile(word, url) {
	//download audio file when adding a new word and store on server

	if (!url) return;

	const route = path.resolve(`./audio-uploads/${word}.mp3`);
	const writer = fs.createWriteStream(route);

	const response = await axios({
		url,
		method: `GET`,
		responseType: `stream`
	});

	response.data.pipe(writer);

	await new Promise((resolve, reject) => {
		writer.on(`finish`, resolve);
		writer.on(`error`, reject);
	});
}

function getWordObject(word, lexicalArray) {
	return lexicalArray.reduce((acc, entry, index) => {
		let {
			derivatives = [],
			entries,
			lexicalCategory: { text: lexicalCategory },
			pronunciations
		} = entry;

		let { etymologies, senses } = entries[0];

		if (!pronunciations) pronunciations = entries[0].pronunciations || [{}];

		let { audioFile, phoneticSpelling } = pronunciations[0];

		senses = returnSenseSchema(senses);

		derivatives = derivatives.map(item => item.text);

		const wordObj = { word, extras: [], derivatives, etymologies, lexicalCategory, phoneticSpelling, audioFile, senses };

		index && acc.extras.push(wordObj);

		return index ? acc : (acc = wordObj);
	}, {});
}

exports.getWordObject = getWordObject;
exports.addAudioFile = addAudioFile;
