export function addSearchEntry(text){
    return {
        type: 'ADD_SEARCH_ENTRY',
        search_text: text,
    }
}