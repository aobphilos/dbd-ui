export abstract class ModelBase {

  id: string;
  updatedDate: Date;
  createdDate: Date;

  constructor() {
    this.createdDate = new Date();
  }
}
