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

    startLoad(arr);
};

async function startLoad(arr) {

    await mongo();

    let results = [];

    const config = {
        headers: {
            app_id: "9d539987",
            app_key: "44e5794c18ad95237d1c95c665a6685d"
        }
    };

    let iterator = arr[Symbol.iterator]();

    let result = iterator.next();

    let stop;

    do {
        const resolved = await axios.get(`https://od-api.oxforddictionaries.com/api/v2/entries/en/${result.value}`, config);

        results.push(resolved);

        console.log("pushed result of ", result.value, Date.now(), result.done);

        if(!result.done)
            await new Promise(resolve => setTimeout(resolve, 2 * 1000));
        
        let next = iterator.next();

        stop = result.done;
        
        if (next) result = next;
        
    } while (!stop)
    
    console.log("url request done");

    await Promise.all(results.map(({ data }) => {
        const { word } = data;
        let { derivatives = [], entries, lexicalCategory: { text: lexicalCategory }, pronunciations } = data.results[0].lexicalEntries[0];
        let { etymologies, senses } = entries[0];

        if (!pronunciations) pronunciations = entries[0].pronunciations; 
        
        const { audioFile, phoneticSpelling } = pronunciations[0];

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


