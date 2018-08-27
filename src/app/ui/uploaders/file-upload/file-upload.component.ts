import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { UploaderType } from '../../../enum/uploader-type';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() uploaderType: UploaderType;

  hasImage: boolean;

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Image URL
  imageURL: Observable<string>;

  // Image Thumb URL
  thumbURL: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  private currentFiles: FileList;

  constructor(private storage: AngularFireStorage) { }

  updateCurrentFiles(files: FileList) {
    this.currentFiles = files;
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload() {
    // prevent click with empty
    if (!this.currentFiles) {
      return;
    }

    // The File object
    const file = this.currentFiles.item(0);
    if (!file || !file.type) {
      return;
    }

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error(`unsupported file type`);
      return;
    }

    // The storage path
    const prefix = new Date().getTime();
    const path = `test/${prefix}_${file.name}`;
    const pathThumb = `test/thumb@128_${prefix}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'dbd-ui' };

    // this.thumbURL = this.storage.ref(pathThumb).getDownloadURL();

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    // The file's download URL
    this.snapshot.pipe(
      finalize(() => {
        this.imageURL = this.storage.ref(path).getDownloadURL();
        this.hasImage = true;
      })
    ).subscribe();

  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  removeImage(image) {
    this.hasImage = false;
    this.imageURL = new Observable<string>();
    this.percentage = new Observable<number>();
    this.snapshot = new Observable<any>();
    image.value = '';
  }

  ngOnInit(): void {
    console.log('upload type: ', this.uploaderType);
  }

}
