
export function createButton(createButton, action){
    let newCreateButton = Object.assign({}, createButton);
    switch (action.type) {
        case 'TOGGLE_TEXT':
            newCreateButton.text = createButton.text === "Create" ? "Cancel": "Create";
            return newCreateButton;
        default:
            return newCreateButton;
    }
}