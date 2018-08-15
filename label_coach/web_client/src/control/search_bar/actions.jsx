export function addSearchEntry(text, id){
    return {
        type: 'ADD_SEARCH_ENTRY',
        id: id,
        search_text: text,
    }
}