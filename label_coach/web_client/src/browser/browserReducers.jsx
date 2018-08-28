import produce from "immer";

export function folderReducer(folder={}, action) {
    switch (action.type) {
        case 'UPDATE_FOLDER_THUMBNAILS':
            return produce(folder, draftState=>{
                draftState.thumbnails = action.thumbnails.map(file => ({
                  id: file._id.$oid
                }))
            })
    }
}

export function folders(folders = [], action) {
    switch (action.type) {
        case 'POPULATE_FOLDERS':
            return produce(folders, draftState => {
                for (let folder of action.folders) {
                    draftState.push({
                                        id: draftState.length,
                                        objId: folder.objId,
                                        name: folder.name,
                                        created: folder.created,
                                        updated: folder.updated
                                    })
                }
            });
        case 'UPDATE_FOLDER_THUMBNAILS':
            return produce(folders, (draftState) => {
                let id = draftState.findIndex(x => x.objId === action.folderId);
                draftState[id] = folderReducer(draftState[id], action);
            });
        default:
            return folders;
    }
}