//Reducer function
export default (state, action) => {
	switch (action.type) {
		case "LOADING":
			return {
				...state,
				loading: true
			};
		case `ADD_WORDS`:
			const { payload } = action;

			return {
				...state,
				words: payload,
				loading: false,
				alert: ""
			};

		case `SEARCH_WORD`:
			const searchResults = action.payload;

			return {
				...state,
				searchResults,
				alerts: [],
				prompts: []
			};

		case `ADD_ALERT`:
			const alert = action.payload;

			return {
				...state,
				alert,
				loading: true
			};

		case `CLEAR_SEARCH`:
			return {
				...state,
				searchResults: {}
			};

		case `REMOVE_WORD`:
			const { word, alert: msg } = action.payload;

			// const index = state.words.findIndex(item => item.word === word);

			// state.words.splice(index, 1);

			return {
				...state,
				alert: msg,
				loading: true
			};

		case `ADD_PROMPTS`:
			const prompt = action.payload;

			if (!prompt)
				return {
					...state,
					prompts: []
				};

			const prompts = state.words.filter(item => item.word.startsWith(prompt));

			return {
				...state,
				prompts
			};

		default:
			break;
	}
};
