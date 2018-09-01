import { ModelBase } from './model-base';

export class Events extends ModelBase {
  eventDate: Date;
  thumbnailUrl: string;
  imageUrl: string;
  subject: string;
  description: string;
  isPublished: boolean;
  constructor() {
    super();
    this.eventDate = new Date();
    this.thumbnailUrl = '';
    this.imageUrl = '';
    this.subject = '';
    this.description = '';
    this.isPublished = false;
  }
}
