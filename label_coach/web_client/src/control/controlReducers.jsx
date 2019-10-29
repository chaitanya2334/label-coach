import produce from "immer";

Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

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


export function saveIndicator(saveIndicator = {text: "", status: "done", lastUpdated: null}, action) {
    return produce(saveIndicator, draft => {
        switch (action.type) {
            case 'EDIT_SAVE_INDICATOR_TEXT':
                draft.text = action.text;
                return draft;
            case 'SET_DIRTY_STATUS':
                draft.status = "dirty";
                return draft;
            case 'SET_DONE_STATUS':
                draft.status = "done";
                return draft;
            case 'SET_LAST_UPDATED':
                draft.lastUpdated = action.date;
                return draft;
            default:
                return draft;
        }
    });
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

export function currentAssignment(currentAssignment = {}, action) {
    return produce(currentAssignment, draft => {
        switch (action.type) {
            case 'SET_CURRENT_ASSIGNMENT':
                draft = action.assignment;
                return draft;
            default:
                return currentAssignment;
        }
    });

}

export function images(images = [], action) {
    return produce(images, draft => {
                       switch (action.type) {
                           case 'POPULATE_IMAGES':
                               draft = [];
                               for (let image of action.images) {
                                   draft.push({
                                                  id: draft.length,
                                                  active: false,
                                                  title: image.title,
                                                  dbId: image.dbId,
                                                  mimeType: image.mimeType,
                                                  labelFileId: image.labelFileId
                                              })
                               }
                               return draft;
                           case 'PUSH_IMAGES':
                               for (let image of action.images) {
                                   draft.push({
                                                  id: draft.length,
                                                  active: false,
                                                  title: image.title,
                                                  dbId: image.dbId,
                                                  mimeType: image.mimeType,
                                                  labelFileId: image.labelFileId
                                              })
                               }
                               return draft;

                           case 'RESET_IMAGES':
                               return [];

                           case 'SELECT_IMAGE':
                               // deselect everybody
                               for (let image of draft) {
                                   image.active = false;
                               }

                               draft[action.image_id] = imageReducer(draft[action.image_id], action);
                               return draft;

                           case 'ADD_LABEL_ID':
                               draft[action.image_id] = imageReducer(draft[action.image_id], action);
                               return draft;

                           default:
                               return images;
                       }
                   }
    );

}

export function hasMoreImages(hasMoreImages = true, action) {
    return produce(hasMoreImages, draft => {
                       switch (action.type) {
                           case 'SET_HAS_MORE_IMAGES':
                               return action.state;
                           default:
                               return draft;
                       }
                   }
    );
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
                                       polygons: label.ann.polygons.map((polygon, index) => ({
                                           id: index,
                                           drawState: "read-only",
                                           text: polygon.text,
                                           points: polygon.points,
                                           selected: false,
                                       })),
                                       lines: label.ann.lines.map((line, index) => ({
                                           id: index,
                                           drawState: "read-only",
                                           text: line.text,
                                           points: line.points,
                                           selected: false,
                                       })),
                                       brushes: label.ann.brushes,
                                       erasers: label.ann.erasers.map((eraser, index) => ({
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
            case 'REPLACE_ANN':
            case 'ADD_BRUSH_ANN':
            case 'LOCK_ANN':
            case 'UNLOCK_ANN':
            case 'DELETE_ANN':
            case 'UPDATE_ANN':
            case 'UPDATE_BRUSH_ANN':
            case 'CANCEL_ANN':
            case 'TOGGLE_BUTTON':
            case "CHANGE_PAGE":
            case 'SELECT_ANN':
            case 'SELECT_ALL_ANN':
            case 'DESELECT_ALL_ANN':
            case 'DESELECT_ANN':
            case 'SHOW_ANN':
            case 'HIDE_ANN':
            case 'SHOW_ALL_ANN':
            case 'HIDE_ALL_ANN':

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
                let newAnn = {id: action.item_id};
                newAnn.text = action.ann_type + newAnn.id;
                newAnn.points = action.points;
                newAnn.drawState = "create";
                for (let key in action.args) {
                    newAnn[key] = action.args[key];
                }
                draft.push(newAnn);
                return draft;

            case 'ADD_BRUSH_ANN':
                let brushAnn = {id: action.item_id};
                brushAnn.text = action.ann_type + brushAnn.id;
                brushAnn.file_id = '';
                brushAnn.drawState = "create";
                brushAnn.transform = [];
                draft.push(brushAnn);
                return draft;

            case 'LOCK_ALL_ANN':
                for (let ann of draft) {
                    draft.find(x => x.id === ann.id).drawState = "read-only";
                }
                return draft;
            case 'REPLACE_ANN':

                if (draft.find(x => x.id === action.item_id) !== undefined) {
                    for (let key in action.args) {
                        draft.find(x => x.id === action.item_id)[key] = action.args[key];
                    }
                } else {
                    let newAnn = {id: action.item_id};
                    newAnn.text = action.ann_type + newAnn.id;
                    newAnn.points = [];
                    newAnn.drawState = "create";
                    for (let key in action.args) {
                        newAnn[key] = action.args[key];
                    }
                    draft.push(newAnn);
                }
                return draft;

            case 'LOCK_ANN':
                draft.find(x => x.id === action.item_id).drawState = "read-only";
                return draft;

            case 'UNLOCK_ANN':
                draft.find(x => x.id === action.item_id).drawState = "edit";
                return draft;

            case 'UPDATE_BRUSH_ANN':
                draft.find(x => x.id === action.item_id).file_id = action.file_id;
                draft.find(x => x.id === action.item_id).transform = action.transform;
                return draft;

            case 'UPDATE_ANN':
                if (draft.find(x => x.id === action.item_id).drawState === "edit" ||
                    draft.find(x => x.id === action.item_id).drawState === "create") {

                    draft.find(x => x.id === action.item_id).points = action.points;
                    for (let key in action.args) {
                        draft.find(x => x.id === action.item_id)[key] = action.args[key];
                    }
                }
                return draft;

            case 'DELETE_ANN':
                draft.remove(draft.findIndex(x => x.id === action.item_id));
                return draft;

            case 'DELETE_ALL_ANN':
                draft = [];
                return draft;

            case 'SELECT_ANN':
                draft.find(x => x.id === action.item_id).selected = true;
                return draft;

            case 'SELECT_ALL_ANN':
                for (let ann of draft) {
                    draft.find(x => x.id === ann.id).selected = true;
                }
                return draft;

            case 'SHOW_ANN':
                draft.find(x => x.id === action.item_id).displayed = true;
                return draft;

            case 'SHOW_ALL_ANN':
                for (let ann of draft) {
                    draft.find(x => x.id === ann.id).displayed = true;
                }
                return draft;

            case 'DESELECT_ANN':
                draft.find(x => x.id === action.item_id).selected = false;
                return draft;

            case 'DESELECT_ALL_ANN':
                for (let ann of draft) {
                    draft.find(x => x.id === ann.id).selected = false;
                }
                return draft;

            case 'HIDE_ANN':
                draft.find(x => x.id === action.item_id).displayed = false;
                return draft;

            case 'HIDE_ALL_ANN':
                for (let ann of draft) {
                    draft.find(x => x.id === ann.id).displayed = false;
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
            case 'REPLACE_ANN':
            case 'ADD_BRUSH_ANN':
            case 'LOCK_ANN':
            case 'LOCK_ALL_ANN':
            case 'UNLOCK_ANN':
            case 'DELETE_ANN':
            case 'UPDATE_ANN':
            case 'UPDATE_BRUSH_ANN':
            case 'SELECT_ANN':
            case 'DESELECT_ANN':
            case 'SHOW_ANN':
            case 'HIDE_ANN':

                draft.ann[action.ann_type] = annotationReducer(draft.ann[action.ann_type], action);
                return draft;

            case 'SELECT_ALL_ANN':
            case 'DESELECT_ALL_ANN':
            case 'SHOW_ALL_ANN':
            case 'HIDE_ALL_ANN':
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

export function navState(navState = false, action) {
    return produce(navState, draft => {
        switch (action.type) {
            case "SET_NAV_STATE":
                return action.state;
            default:
                return draft;
        }
    });
}

export function imageReady(imageReady = false, action){
    return produce(imageReady, draft=>{
        switch (action.type) {
            case "IMAGE_READY":
                return true;
            case "IMAGE_NOT_READY":
                return false;
            default:
                return draft;
        }
    });
}