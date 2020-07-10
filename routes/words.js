const router = require("express").Router();
const { getWords, getWord, deleteWord, addWord } = require("../controllers/words");

router.route("/words").get(getWords);

router.route("/words/:word").get(getWord).post(addWord).delete(deleteWord);

module.exports = router;
