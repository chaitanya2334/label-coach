
export function searchLabels(search="", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if(action.id === "labels") {
                return action.search_text;
            }
        default:
            return search;
    }
}

export function searchImages(search="", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if(action.id === "images") {
                return action.search_text;
            }
        default:
            return search;
    }
}