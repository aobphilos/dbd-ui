import { NotifyType } from '../enum/notify-type';

export class Notify {
    message: string;
    type: NotifyType;

    constructor() {
        this.message = '';
        this.type = NotifyType.INFO;
    }
}
