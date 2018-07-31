
export function addPolygon(label){
    return {
        type: 'ADD_POLY',
        label_id: label.id,
    }
}

export function updatePolygon(label_id, polygon_id, points){
    return {
        type: 'UPDATE_POLY',
        label_id: label_id,
        poly_id: polygon_id,
        points: points
    }
}

export function cancelPolygon(label){
    return {
        type: 'CANCEL_POLY',
        label_id: label.id
    }
}