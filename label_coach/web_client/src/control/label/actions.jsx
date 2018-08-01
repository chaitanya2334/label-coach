export function toggleLabel(label){
    return {
        type: 'TOGGLE_LABEL',
        label_id: label.id,
    }
}