
export function addPolygon(label_id){
    return {
        type: 'ADD_POLY',
        label_id: label_id,
    }
}

export function lockPolygon(label_id, polygon_id){
    return {
        type: 'LOCK_POLY',
        label_id: label_id,
        poly_id: polygon_id
    }
}

export function unlockPolygon(label_id, polygon_id){
    return{
        type: 'UNLOCK_POLY',
        label_id: label_id,
        poly_id: polygon_id
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

export function cancelPolygon(label_id){
    return {
        type: 'CANCEL_POLY',
        label_id: label_id
    }
}