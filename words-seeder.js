const fs = require("fs");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const mongo = require("./config/mongo");

const Word = require("./models/Word");
const { returnSenseSchema } = require("./models/Sense");

//Start
fs.readFile(`./words.txt`, `utf8`, importWords);

process.on("unhandledRejection", error => {
    console.log(`Unhandled rejection: ${error}`);
    process.exit(1);
});

function importWords(err, data) {
    data = data.trim();
    const arr = data.split("\r\n");

    const num = Math.ceil(arr.length / 50);
    const final_arr = [];

    if (num == 1) final_arr.push(arr);
    else {
        let length = arr.length;
        let start = 0;

        while (length > 0) {
            const add_arr = arr.slice(start, length >= 50 ? 50 : length + start);
            length -= 50;
            start += 50;
            final_arr.push(add_arr);
        }
    }

    startLoad(final_arr);
};

async function startLoad(arr) {

    await mongo();

    let results = [];

    let iterator = arr[Symbol.iterator]();

    for (let result = iterator.next(); !result.done;) {

        const resolves = await Promise.all(result.value.map(async word => {
            const config = {
                headers: {
                    app_id: "9d539987",
                    app_key: "44e5794c18ad95237d1c95c665a6685d"
                }
            };
        
            console.log(word);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return axios.get(`https://od-api.oxforddictionaries.com/api/v2/entries/en/${word}`, config);
        }));

        results.push(...resolves);

        result = iterator.next();

        console.log("finished 1 array");

        if(!result.done)
        await new Promise(resolve => setTimeout(resolve, 70 * 1000));
    }

    await Promise.all(results.map(({ data }) => {
        const { word } = data;
        let { derivatives = [], entries, lexicalCategory: { text: lexicalCategory }, pronunciations } = data.results[0].lexicalEntries[0];
        const { audioFile, phoneticSpelling } = pronunciations[0];
        let { etymologies, senses } = entries[0];

        senses = returnSenseSchema(senses);

        derivatives = derivatives.map(item => item.text);

        addAudioFile(word, audioFile);

        return Word.create({ word, derivatives, etymologies, lexicalCategory, phoneticSpelling, audioFile, senses });
    }));

    console.log("All words added to MongoDB");

    process.exit(0);
}

async function addAudioFile(word, url) {
    //download audio file when adding a new word and store on server
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


