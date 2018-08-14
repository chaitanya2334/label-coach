export default function annotationReducer(ann, action) {
    let newAnn = Object.assign({}, ann);
    switch (action.type) {
        case 'ADD_ANN':
            newAnn.text = action.ann_type + newAnn.id;
            newAnn.points = [];
            newAnn.drawState = "create";
            return newAnn;

        case 'LOCK_ANN':
            newAnn.drawState = "read-only";
            return newAnn;

        case 'UNLOCK_ANN':
            newAnn.drawState = "edit";
            return newAnn;

        case 'UPDATE_ANN':
            if (newAnn.drawState === "edit" || newAnn.drawState === "create") {
                newAnn.points = action.points;
            }
            return newAnn;
    }

}