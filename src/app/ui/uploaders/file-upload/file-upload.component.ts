import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  get hasImage() {
    return (this.previewURL && this.previewURL !== '');
  }

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Image URL
  imageURL: Observable<string>;

  // Preview Image in Local
  previewURL: string | ArrayBuffer;

  // State for dropzone CSS toggling
  isHovering: boolean;

  private currentFiles: FileList;

  constructor(private storage: AngularFireStorage) { }

  updateCurrentFiles(files: FileList) {
    this.currentFiles = files;
    this.readUrl();
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
      })
    ).subscribe();

  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  readUrl() {
    // prevent click with empty
    if (!this.currentFiles) {
      return;
    }

    // The File object
    const file = this.currentFiles.item(0);
    if (!file || !file.type) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      this.previewURL = (<FileReader>event.target).result;
    };

    reader.readAsDataURL(file);

  }

  removeImage(image) {
    image.value = '';
    this.imageURL = new Observable<string>();
    this.percentage = new Observable<number>();
    this.snapshot = new Observable<any>();
    this.previewURL = null;
    this.currentFiles = null;
  }

  ngOnInit(): void {
  }

}
