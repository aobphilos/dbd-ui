"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Takes an the Algolia index and key of document to be deleted
const removeObject = (index, key) => {
    // then it deletes the document
    return index.deleteObject(key, (err) => {
        if (err)
            throw err;
        console.log('Key Removed from Algolia Index', key);
    });
};
// Takes an the Algolia index and data to be added or updated to
const upsertObject = (index, data) => {
    // then it adds or updates it
    return index.saveObject(data, (err, content) => {
        if (err)
            throw err;
        console.log(`Document ${data.objectID} Updated in Algolia Index `);
    });
};
// Takes an Algolia index and a Firestore event and uses event data to keep them in sync
exports.syncAlgoliaWithFirestore = (index, event) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const data = event.after.exists ? event.after.data() : null;
    const key = event.after.id;
    // If no data then it was a delete event
    if (!data) {
        // so delete the document from Algolia index
        return removeObject(index, key);
    }
    // add objectId param to data object and set it to key of Firestore document
    data['objectID'] = key;
    // upsert the data to the Algolia index
    return upsertObject(index, data);
};
//# sourceMappingURL=algoliaSync.js.map