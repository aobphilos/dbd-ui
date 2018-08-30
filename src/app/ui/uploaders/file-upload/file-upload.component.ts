import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { UploaderType } from '../../../enum/uploader-type';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() uploaderType: UploaderType;
  @Input() @Output() imageUrl: string;

  get hasImage() {
    return (this.previewURL && this.previewURL !== '');
  }

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

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
    return new Promise<Observable<any>>((resolve, reject) => {

      // prevent click with empty
      if (!this.currentFiles) {
        reject('Image has empty');
        return;
      }

      // The File object
      const file = this.currentFiles.item(0);
      if (!file || !file.type) {
        reject('Image has empty');
        return;
      }

      // Client-side validation example
      if (file.type.split('/')[0] !== 'image') {
        reject(`unsupported file type`);
        return;
      }

      // The storage path
      const prefix = new Date().getTime();
      const path = `${this.uploaderType}/${prefix}_${file.name}`;

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
          resolve(this.storage.ref(path).getDownloadURL());
        })
      ).subscribe();

    });
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
    this.percentage = new Observable<number>();
    this.snapshot = new Observable<any>();
    this.previewURL = null;
    this.currentFiles = null;
  }

  ngOnInit(): void {
  }

}
