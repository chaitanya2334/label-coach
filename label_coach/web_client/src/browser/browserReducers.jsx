import produce from "immer";

export function assignmentReducer(assignment = {}, action) {
    return produce(assignment, draft => {
                       switch (action.type) {
                           case 'UPDATE_FOLDER_THUMBNAILS':
                               draft.thumbnails = action.thumbnails.map(file => ({
                                   id: file._id.$oid,
                                   mimeType: file.mimeType
                               }));
                               return draft;
                           default:
                               return draft;

                       }
                   }
    );
}

export function assignments(assignments = [], action) {
    return produce(assignments, draft => {
                       switch (action.type) {
                           case 'POPULATE_ASSIGNMENTS':
                               draft = [];

                               for (let assignment of action.assignments) {
                                   let {name, image_folder, label_folders, owner} = assignment;

                                   draft.push({
                                                  id: image_folder._id.$oid,
                                                  name: name,
                                                  imageFolder: {
                                                      objId: image_folder._id.$oid,
                                                      name: image_folder.name,
                                                      created: image_folder.created,
                                                      updated: image_folder.updated
                                                  },
                                                  labelFolders: label_folders.map((folder) => ({
                                                      objId: folder._id.$oid,
                                                      name: folder.name,
                                                      created: folder.created,
                                                      updated: folder.updated
                                                  })),
                                                  owner: owner
                                              })
                               }
                               return draft;

                           case 'UPDATE_FOLDER_THUMBNAILS':
                               let idx = draft.findIndex(x => x.id === action.assignmentId);
                               draft[idx] = assignmentReducer(draft[idx], action);
                               return draft;
                           default:
                               return draft;
                       }
                   }
    );
}