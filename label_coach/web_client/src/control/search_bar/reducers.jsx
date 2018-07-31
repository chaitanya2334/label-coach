
export function search(search="", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            return action.search_text;
        default:
            return search;
    }
}