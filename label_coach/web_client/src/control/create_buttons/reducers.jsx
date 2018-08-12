
export function createButton(createButton, action){
    let newCreateButton = Object.assign({}, createButton);
    switch (action.type) {
        case 'TOGGLE_TEXT':
            newCreateButton[action.button_type].text = createButton[action.button_type].text === "Create" ? "Cancel": "Create";
            return newCreateButton;
        default:
            return newCreateButton;
    }
}