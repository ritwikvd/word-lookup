const mongoose = require("mongoose");

const SenseSchema = new mongoose.Schema({
    definitions: [String],
    examples: [String],
    subsenses: [this],
    synonyms: [String],
    domains: [String],
    registers: [String]
});

const returnSenseSchema = arr => {
    return arr.map(obj => {

        let { definitions, examples = [], subsenses = [], synonyms = [], domains = [], registers = [] } = obj;

        examples = examples.map(item => item.text);
        synonyms = synonyms.map(item => item.text);
        domains = domains.map(item => item.text);
        registers = registers.map(item => item.text);

        const Sense = mongoose.model("Sense", SenseSchema);

        const sense = new Sense({
            definitions,
            examples,
            synonyms,
            domains,
            registers,
            subsenses: returnSenseSchema(subsenses)
        });

        return sense;
    });
};

module.exports = { SenseSchema, returnSenseSchema };

