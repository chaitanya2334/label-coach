import {restRequest} from "girder/rest";

export function expandAdminLabel(user_id, label_id, state){
    return {
        type: "EXPAND_ADMIN_LABEL",
        user_id: user_id,
        label_id: label_id,
        state: state
    }
}

export function expandAdminAnnotator(user_id, state){
    return {
        type: "EXPAND_ADMIN_ANNOTATOR",
        user_id: user_id,
        state: state,
    }
}

export function setAdminData(adminData) {
    return {
        type: 'SET_ADMIN_DATA',
        adminData: adminData
    }
}

export function setAdminLabels(user_id, labels){
    return {
        type: 'SET_ADMIN_LABELS',
        user_id: user_id,
        labels: labels,
    }
}

export function fetchAdminData(assignmentId) {
    return function (dispatch) {
        return restRequest({
                               url: "/assignment/admin_data",
                               method: 'GET',
                               data: {
                                   a_id: assignmentId
                               }
                           })
            .then(response => {
                if (typeof response === 'string') {
                    if(response) {
                        return JSON.parse(response);
                    }else{
                        return [];
                    }
                } else {
                    return response;
                }
            })
            .then(adminData => {
                dispatch(setAdminData(adminData))
            });
    }
}

export function showAnnotation(user_id, label_id, ann_type, item_id){
    return {
        type: 'SHOW_ADMIN_ANN',
        user_id: user_id,
        label_id: label_id,
        ann_type: ann_type,
        item_id: item_id,
    }
}

export function showAllAnnotations(user_id, label_id){
    return {
        type: 'ADMIN_SHOW_ALL_ANN',
        user_id: user_id,
        label_id: label_id
    }
}

export function hideAllAnnotations(user_id, label_id){
    return {
        type: 'ADMIN_HIDE_ALL_ANN',
        user_id: user_id,
        label_id: label_id
    }
}


export function hideAnnotation(user_id, label_id, ann_type, item_id){
    return {
        type: 'HIDE_ADMIN_ANN',
        user_id: user_id,
        label_id: label_id,
        ann_type: ann_type,
        item_id: item_id,
    }
}

export function fetchAdminLabels(label_name, user, folder_id) {
    return function (dispatch) {
        return restRequest({
                               url: "/label/by_name",
                               method: 'GET',
                               data: {
                                   file_name: label_name,
                                   folder_id: folder_id
                               }
                           })
            .then(response => {
                if (typeof response === 'string') {
                    return JSON.parse(response);
                } else {
                    return response;
                }
            })
            .then(obj => {

                dispatch(setAdminLabels(user, obj.labels))
            });
    }
}