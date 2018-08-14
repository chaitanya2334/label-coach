
export function addAnnotation(ann_type, label_id){
    return {
        type: 'ADD_ANN',
        ann_type: ann_type,
        label_id: label_id,
    }
}

export function lockAnnotation(ann_type, label_id, item_id){
    return {
        type: 'LOCK_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id
    }
}

export function unlockAnnotation(ann_type, label_id, item_id){
    return{
        type: 'UNLOCK_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id
    }
}

export function updateAnnotation(ann_type, label_id, item_id, points){
    return {
        type: 'UPDATE_ANN',
        ann_type: ann_type,
        label_id: label_id,
        item_id: item_id,
        points: points
    }
}

export function cancelAnnotation(ann_type, label_id){
    return {
        type: 'CANCEL_ANN',
        ann_type: ann_type,
        label_id: label_id
    }
}