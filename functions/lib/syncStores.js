"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");
const algoliaSync = require("./utils/algoliaSync");
const algolia = algoliasearch(functions.config().algolia.appid, functions.config().algolia.adminkey);
const collectionName = 'Store';
// Write to the algolia index
const index = algolia.initIndex(collectionName);
exports.syncStores = functions
    .region('asia-northeast1')
    .firestore
    .document(`/${collectionName}/{id}`)
    .onWrite(event => {
    return algoliaSync.syncAlgoliaWithFirestore(index, event);
});
//# sourceMappingURL=syncStores.js.map