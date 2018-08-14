export function toggleLabelButton(label_id, button_type){
    return {
        type: 'TOGGLE_BUTTON',
        button_type: button_type,
        label_id: label_id,
    };
}
