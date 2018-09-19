import { IRelatedBase } from './interfaces/related-base';
import { IImageBase } from './interfaces/image-base';
import { firestore } from 'firebase/app';

export abstract class ModelBase {

  id: string;
  updatedDate: firestore.Timestamp;
  createdDate: firestore.Timestamp;

  constructor() {
    this.createdDate = firestore.Timestamp.now();
    this.updatedDate = firestore.Timestamp.now();
  }
}

export abstract class ModelRelatedImageBase
  extends ModelBase
  implements IRelatedBase, IImageBase {

  isPublished: boolean;

  ownerId: string;
  followerIds: string[];

  imageUrl: string;
  description: string;

  // ref to owner
  storeName: string;

  constructor() {
    super();
    this.isPublished = true;
    this.ownerId = '';
    this.followerIds = [];
    this.imageUrl = '';
    this.description = '';
    this.storeName = '';
  }

}
