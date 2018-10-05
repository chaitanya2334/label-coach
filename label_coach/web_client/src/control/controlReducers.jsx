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

export function thumbnailBarVisibility(thumbnailBarVisibility = false, action) {
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
                                   name: label.name,
                                   poly_button: true,
                                   line_button: true,
                                   color: label.color,
                                   polygons: label.polygons.map((polygon, index) => ({
                                       id: index,
                                       drawState: "read-only",
                                       text: polygon.text,
                                       points: polygon.points
                                   })),
                                   lines: label.lines.map((line, index) => ({
                                       id: index,
                                       drawState: "read-only",
                                       text: line.text,
                                       points: line.points
                                   })),
                                   brushes: label.brushes.map((brush, index) => ({
                                       id: index,
                                       drawState: "read-only",
                                       text: brush.text,
                                       points: brush.points,
                                       brush_radius: brush.brush_radius
                                   })),
                                   erasers: label.erasers.map((eraser, index) => ({
                                       id: index,
                                       drawState: "read-only",
                                       text: eraser.text,
                                       points: eraser.points
                                   })),
                               });
                }
                return draft;
            case 'ADD_ANN':
            case 'LOCK_ANN':
            case 'UNLOCK_ANN':
            case 'UPDATE_ANN':
            case 'CANCEL_ANN':
            case 'TOGGLE_BUTTON':
            case 'TOGGLE_LABEL':

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
                draft[action.label_id] = labelReducer(draft[action.label_id], action)
                return draft;

            default:
                return draft;

        }
    });


}

export function annotationReducer(ann, action) {
    return produce(ann, draft => {
        switch (action.type) {
            case 'ADD_ANN':
                draft.text = action.ann_type + draft.id;
                draft.points = [];
                draft.drawState = "create";
                for (let key in action.args) {
                    draft[key] = action.args[key];
                }
                return draft;

            case 'LOCK_ANN':
                draft.drawState = "read-only";
                return draft;

            case 'UNLOCK_ANN':
                draft.drawState = "edit";
                return draft;

            case 'UPDATE_ANN':
                if (draft.drawState === "edit" || draft.drawState === "create") {
                    draft.points = action.points;
                    for (let key in action.args) {
                        draft[key] = action.args[key];
                    }
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
                switch (action.ann_type) {
                    case "polygon":
                        draft.polygons.push(annotationReducer({id: label.polygons.length}, action));
                        break;
                    case "line":
                        draft.lines.push(annotationReducer({id: label.lines.length}, action));
                        break;
                    case "brush":
                        draft.brushes.push(annotationReducer({id: label.brushes.length}, action));
                        break;
                    case "eraser":
                        draft.erasers.push(annotationReducer({id: label.erasers.length}, action));
                        break;
                }
                return draft;

            case 'LOCK_ALL_ANN':
                let subAction = Object.assign({}, action);
                subAction.type = "LOCK_ANN";
                switch (action.ann_type) {
                    case "line":
                        for (let line of draft.lines) {
                            draft.lines[line.id] = annotationReducer(draft.lines[line.id], subAction);
                        }
                        return draft;
                    case "polygon":
                        for (let polygon of draft.polygons) {
                            draft.polygons[polygon.id] = annotationReducer(draft.polygons[polygon.id], subAction);
                        }
                        return draft;
                    case "brush":
                        for (let brush of draft.brushes) {
                            draft.brushes[brush.id] = annotationReducer(draft.brushes[brush.id], subAction);
                        }
                        return draft;
                    case "eraser":
                        for (let eraser of draft.erasers) {
                            draft.erasers[eraser.id] = annotationReducer(draft.erasers[eraser.id], subAction);
                        }
                        return draft;
                    default:
                        return draft;
                }

            case 'LOCK_ANN':
            case 'UNLOCK_ANN':
            case 'UPDATE_ANN':
                switch (action.ann_type) {
                    case "polygon":
                        draft.polygons[action.item_id] =
                            annotationReducer(draft.polygons[action.item_id], action);
                        break;
                    case "line":
                        draft.lines[action.item_id] = annotationReducer(draft.lines[action.item_id], action);
                        break;
                    case "brush":
                        draft.brushes[action.item_id] = annotationReducer(draft.brushes[action.item_id], action);
                        break;
                    case "eraser":
                        draft.erasers[action.item_id] = annotationReducer(draft.erasers[action.item_id], action);
                        break;
                }
                return draft;

            case 'CANCEL_ANN':
                switch (action.ann_type) {
                    case "polygon":
                        draft.polygons.pop();
                        break;
                    case "line":
                        draft.lines.pop();
                        break;
                }
                return draft;

            case 'TOGGLE_BUTTON':
                draft[action.button_type] = !draft[action.button_type];
                return draft;

            case 'TOGGLE_LABEL':
                draft.active = !draft.active;
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

            default:
                return draft;
        }
    });
}