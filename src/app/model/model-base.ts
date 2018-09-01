import { IRelatedBase } from './related-base';
import { IImageBase } from './image-base';
import { firestore } from 'firebase/app';

export abstract class ModelBase {

  id: string;
  updatedDate: firestore.Timestamp;
  createdDate: firestore.Timestamp;

  constructor() {
    this.createdDate = firestore.Timestamp.now();
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

  constructor() {
    super();
    this.isPublished = true;
    this.ownerId = '';
    this.followerIds = [];
    this.imageUrl = '';
    this.description = '';
  }

}
