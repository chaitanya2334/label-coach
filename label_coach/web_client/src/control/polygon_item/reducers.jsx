export default function polygonReducer(poly, action){
    let newPoly = Object.assign({}, poly);
    newPoly.points = action.points;
    return newPoly
}