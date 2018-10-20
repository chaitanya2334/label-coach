import produce from "immer";

export function tools(tools = {
    "brush": {},
    "eraser": {},
    "line": {},
    "polygon": {}
}, action) {
    switch (action.type) {
        case "SET_SIZE":
            return produce(tools, draftState => {
                draftState[action.toolType] = toolReducer(draftState[action.toolType], action);
            });
        case "SET_OUTLINE":
            return produce(tools, draftState => {
                draftState["brush"] = toolReducer(draftState["brush"], action);
            });
        default:
            return tools;
    }
}

export function toolReducer(tool = {}, action) {
    switch (action.type) {
        case "SET_SIZE":
            return produce(tool, draftState => {
                draftState["size"] = action.value;
            });
        case "SET_OUTLINE":
            return produce(tool, draftState => {
                draftState["outline"] = action.state;
            });
        default:
            return tool;
    }
}

export function showHeader(showHeader = true, action) {
    switch (action.type) {
        case "SET_HEADER":
            return produce(showHeader, draftState => {
                return action.state;
            });
        default:
            return showHeader;
    }
}

export function thumbnailBarVisibility(thumbnailBarVisibility = true, action) {
    switch (action.type) {
        case 'SET_THUMBNAIL_BAR_VIS':
            return produce(thumbnailBarVisibility, draftState => {
                return action.state;
            });
        default:
            return thumbnailBarVisibility;
    }
}


export function rightBar(rightBar = "", action) {
    switch (action.type) {
        case 'SELECT_RIGHT_BAR':
            return produce(rightBar, draftState => {
                return action.value;
            });
        default:
            return rightBar;
    }
}


export function saveIndicator(saveIndicator = {}, action) {
    switch (action.type) {
        case 'EDIT_SAVE_INDICATOR_TEXT':
            return produce(saveIndicator, draftState => {
                draftState.text = action.text
            });
        case 'SET_SAVE_STATUS':
            return produce(saveIndicator, draftState => {
                draftState.status = action.status
            });
        case 'SET_LAST_UPDATED':
            return produce(saveIndicator, draftState => {
                draftState.lastUpdated = action.date;
            });
        default:
            return saveIndicator;
    }
}

export function imageReducer(image, action) {
    switch (action.type) {
        case 'SELECT_IMAGE':
            return produce(image, draftState => {
                draftState.active = true;
            });
        case 'DESELECT_IMAGE':
            return produce(image, draftState => {
                draftState.active = false;
            });
        case 'ADD_LABEL_ID':
            return produce(image, draftState => {
                draftState.labelFileId = action.label_id
            });
        default:
            return image;
    }
}

export function currentFolder(currentFolder = {}, action) {
    switch (action.type) {
        case 'SET_CURRENT_FOLDER':
            return produce(currentFolder, draftState => {
                draftState.id = action.id;
            });
        default:
            return currentFolder;
    }
}

export function images(images = [], action) {
    switch (action.type) {
        case 'POPULATE_IMAGES':

            return produce(images, draftState => {
                draftState = [];
                for (let image of action.images) {
                    draftState.push({
                                        id: draftState.length,
                                        active: false,
                                        title: image.title,
                                        dbId: image.dbId,
                                        mimeType: image.mimeType,
                                        labelFileId: image.labelFileId
                                    })
                }
                return draftState;
            });
        case 'SELECT_IMAGE':
            return produce(images, (draftState) => {
                // deselect everybody
                for (let image of draftState) {
                    image.active = false;
                }

                draftState[action.image_id] = imageReducer(draftState[action.image_id], action)
            });
        case 'ADD_LABEL_ID':
            return produce(images, (draftState) => {
                draftState[action.image_id] = imageReducer(draftState[action.image_id], action)
            });
        default:
            return images;
    }
    return images;
}

export function searchLabels(search = "", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if (action.id === "labels") {
                return action.search_text;
            }
        default:
            return search;
    }
}

export function searchImages(search = "", action) {
    switch (action.type) {
        case 'ADD_SEARCH_ENTRY':
            if (action.id === "images") {
                return action.search_text;
            }
        default:
            return search;
    }
}

export function labels(labels = [], action) {
    return produce(labels, draft => {
        switch (action.type) {
            case 'REPLACE_LABELS':
                draft = [];
                for (let label of action.labels) {
                    draft.push({
                                   id: draft.length,
                                   active: false,
                                   expanded: false,
                                   name: label.name,
                                   poly_button: true,
                                   line_button: true,
                                   color: label.color,
                                   ann: {
                                       polygons: label.polygons.map((polygon, index) => ({
                                           id: index,
                                           drawState: "read-only",
                                           text: polygon.text,
                                           points: polygon.points,
                                           selected: false,
                                       })),
                                       lines: label.lines.map((line, index) => ({
                                           id: index,
                                           drawState: "read-only",
                                           text: line.text,
                                           points: line.points,
                                           selected: false,
                                       })),
                                       brushes: label.brushes.map((brush, index) => ({
                                           id: index,
                                           drawState: "read-only",
                                           text: brush.text,
                                           points: brush.points,
                                           brush_radius: brush.brush_radius,
                                           selected: false,
                                       })),
                                       erasers: label.erasers.map((eraser, index) => ({
                                           id: index,
                                           drawState: "read-only",
                                           text: eraser.text,
                                           points: eraser.points,
                                           selected: false
                                       })),
                                   },
                                   page: 0
                               });
                }
                return draft;
            case 'ADD_ANN':
            case 'LOCK_ANN':
            case 'UNLOCK_ANN':
            case 'UPDATE_ANN':
            case 'CANCEL_ANN':
            case 'TOGGLE_BUTTON':
            case "CHANGE_PAGE":
            case 'SELECT_ANN':
            case 'SELECT_ALL_ANN':
            case 'DESELECT_ALL_ANN':
            case 'DESELECT_ANN':

                draft[action.label_id] = labelReducer(draft[action.label_id], action);
                return draft;

            case 'EXPAND_LABEL':
                for (let label of draft) {
                    label.expanded = false;
                }

                draft[action.label_id] = labelReducer(draft[action.label_id], action);
                return draft;

            case 'LOCK_ALL_ANN':
                for (let label of draft) {
                    draft[label.id] = labelReducer(draft[label.id], action);
                }
                return draft;

            case "SELECT_LABEL":

                for (let label of draft) {
                    label.active = false;
                }
                draft[action.label_id] = labelReducer(draft[action.label_id], action);
                return draft;

            default:
                return draft;

        }
    });


}

export function annotationReducer(ann, action) {
    //ann_type can be polygons, lines, brushes, or erasers.
    // This reducer handles the full array of a single type of annotations
    return produce(ann, draft => {
        switch (action.type) {
            case 'ADD_ANN':
                let newAnn = {id: draft.length};
                newAnn.text = action.ann_type + newAnn.id;
                newAnn.points = [];
                newAnn.drawState = "create";
                for (let key in action.args) {
                    newAnn[key] = newAnn.args[key];
                }
                draft.push(newAnn);
                return draft;

            case 'LOCK_ALL_ANN':
                for (let ann of draft) {
                    draft[ann.id].drawState = "read-only";
                }
                return draft;

            case 'LOCK_ANN':
                draft[action.item_id].drawState = "read-only";
                return draft;

            case 'UNLOCK_ANN':
                draft[action.item_id].drawState = "edit";
                return draft;

            case 'UPDATE_ANN':
                if (draft[action.item_id].drawState === "edit" || draft[action.item_id].drawState === "create") {
                    draft[action.item_id].points = action.points;
                    for (let key in action.args) {
                        draft[action.item_id][key] = action.args[key];
                    }
                }
                return draft;

            case 'SELECT_ANN':
                draft[action.item_id].selected = true;
                return draft;

            case 'SELECT_ALL_ANN':
                for (let ann of draft) {
                    draft[ann.id].selected = true;
                }
                return draft;

            case 'DESELECT_ANN':
                draft[action.item_id].selected = false;
                return draft;

            case 'DESELECT_ALL_ANN':
                for (let ann of draft) {
                    draft[ann.id].selected = false;
                }
                return draft;
        }
    });
}

function getToolContainer(toolName) {
    switch (toolName) {
        case "line":
            return "lines";
        case "polygon":
            return "polygons";
        case "brush":
            return "brushes";
        case "eraser":
            return "erasers";
    }
}

export function labelReducer(label, action) {
    return produce(label, draft => {
        switch (action.type) {
            case 'ADD_ANN':
            case 'LOCK_ANN':
            case 'LOCK_ALL_ANN':
            case 'UNLOCK_ANN':
            case 'UPDATE_ANN':
            case 'SELECT_ANN':
            case 'DESELECT_ANN':
                draft.ann[action.ann_type] = annotationReducer(draft.ann[action.ann_type], action);
                return draft;

            case 'SELECT_ALL_ANN':
            case 'DESELECT_ALL_ANN':
                for (let ann_type in draft.ann) {
                    if (draft.ann.hasOwnProperty(ann_type)) {
                        draft.ann[ann_type] = annotationReducer(draft.ann[ann_type], action);
                    }
                }
                return draft;

            case 'TOGGLE_BUTTON':
                draft[action.button_type] = !draft[action.button_type];
                return draft;

            case 'EXPAND_LABEL':
                draft.expanded = action.state;
                return draft;

            case "SELECT_LABEL":
                draft.active = true;
                return draft;

            case 'TOGGLE_COLLAPSE':
                draft.collapse = !draft.collapse;
                return;

            case 'TOGGLE_Expand':
                draft.areaexpand = !draft.areaexpand;
                return;
            case 'CHANGE_PAGE':
                draft.page = action.page;
                return draft;

            default:
                return draft;
        }
    });
}