export default (state, action) => {
    switch (action.type) {
        case `SEARCH_WORD`:

            const { searchedWord, searchResults } = action.payload;
            
            return {
                ...state,
                searchedWord,
                searchResults,
                alerts: []
            };
        
        case "ADD_ALERT":

            const { alert } = action.payload;
            const { alerts } = state;
            alerts.push(alert);

            return {
                ...state,
                alerts
            }
    
        default:
            break;
    }
};