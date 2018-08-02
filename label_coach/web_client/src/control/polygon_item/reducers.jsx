export default function polygonReducer(poly, action) {
    let newPoly = Object.assign({}, poly);
    switch (action.type) {
        case 'ADD_POLY':
            newPoly.text = "polygon" + newPoly.id;
            newPoly.points = [];
            newPoly.drawState = "create";
            return newPoly;

        case 'LOCK_POLY':
            newPoly.drawState = "read-only";
            return newPoly;

        case 'UNLOCK_POLY':
            newPoly.drawState = "edit";
            return newPoly;

        case 'UPDATE_POLY':
            if (newPoly.drawState === "edit" || newPoly.drawState === "create") {
                newPoly.points = action.points;
            }
            return newPoly;
    }

}