export function toggleLabel(label){
    return {
        type: 'TOGGLE_LABEL',
        id: label.id,
    }
}