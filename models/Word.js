const mongoose = require("mongoose");
const { SenseSchema } = require("./Sense");

const WordSchema = new mongoose.Schema({
	word: {
		type: String,
		required: [true, "Please add a name"]
	},
	extras: {
		type: [this],
		default: []
	},
	derivatives: {
		type: [String],
		default: "N/A"
	},
	etymologies: {
		type: [String],
		default: "N/A"
	},
	lexicalCategory: {
		type: String,
		default: "N/A"
	},
	phoneticSpelling: {
		type: String,
		default: "N/A"
	},
	audioFile: {
		type: String,
		default: "N/A"
	},
	senses: {
		type: [SenseSchema],
		required: [true, "No definitions found"]
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Word", WordSchema);
