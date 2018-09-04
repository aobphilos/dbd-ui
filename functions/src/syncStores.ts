import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';
import * as algoliaSync from './utils/algoliaSync';

const algolia = algoliasearch(
  functions.config().algolia.appid,
  functions.config().algolia.adminkey
);

const collectionName = 'Store';

// Write to the algolia index
const index = algolia.initIndex(collectionName);

export const syncStores = functions
  .region('asia-northeast1')
  .firestore
  .document(`/${collectionName}/{id}`)
  .onWrite(
    event => {
      return algoliaSync.syncAlgoliaWithFirestore(index, event);
    }
  );