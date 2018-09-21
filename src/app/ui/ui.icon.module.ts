import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCircle, faEdit, faTrashAlt, faPlus, faImage,
  faSearch, faPhone, faStoreAlt, faHeart
} from '@fortawesome/free-solid-svg-icons';

import {
  faHeart as faHeartO
} from '@fortawesome/free-regular-svg-icons';

export class LibraryIcons {
  constructor() {
    library.add(
      faCircle, faEdit, faTrashAlt, faPlus, faImage,
      faSearch, faPhone, faStoreAlt, faHeart, faHeartO
    );
  }
}
