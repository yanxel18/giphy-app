import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import * as filesaver from 'file-saver';
import { Subscription } from 'rxjs';
import { DbService } from 'src/dbservice/db.service';
import { IGifDB, ISkeletonLoader } from 'src/models/web-interface';
@Component({
  selector: 'app-c-imageview-dialog',
  templateUrl: './c-imageview-dialog.component.html',
  styleUrls: ['./c-imageview-dialog.component.sass'],
  providers: [AppService, DbService],
})
export class CImageviewDialogComponent implements OnInit, OnDestroy {
  gifReceiveData!: IGifDB;
  imageTitleShort: string | null = null;
  imageTitleLong: string | null= null;;
  imageOnload: boolean = false;
  Subscriptions: Subscription[] = [];
  isDownload: boolean = false;
  hasSavedImage!: boolean;
  constructor(
    public dialogRef: MatDialogRef<CImageviewDialogComponent>,
    private appService: AppService,
    private dbService: DbService,
    @Inject(MAT_DIALOG_DATA) public gifData: IGifDB
  ) {
    this.gifReceiveData = gifData;
    const getDefaultView: string | null =
      this.appService.tempGetKey('_default');
    this.isDownload = gifData.download === 1 ? true : false;
  }
  loaderTagStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '200px',
    'border-radius': '0px',
    width: '300px',
    margin: '0px',
  };
  /**
   * Initialized the browser title and checks
   * if the image is already saved by (this.hasSavedImage) flag.
   */
  ngOnInit(): void {
    this.initializeDialog();
  }
  initializeDialog(): void {
    const newtitle = this.gifReceiveData.title === ''
    ? this.gifReceiveData.username
    : this.gifReceiveData.username === ''
    ? this.gifReceiveData.slug
: this.gifReceiveData.title;  
    this.imageTitleLong = (
      newtitle) ? newtitle : '';
    this.imageTitleShort = this.titleShortener(this.imageTitleLong);
    this.hasSavedImage = this.dbService.checkIfExist(this.gifReceiveData);
  }
 
  /**
   * 
   * @param title received title to be shortened
   * @returns the shortened title
   */
  titleShortener(title: string | null): string | null {
    return this.appService.titleShortener(title);
  }
  /**
   * Download the GIF image as file using high resolution Giphy API URL.
   */
  downloadGIF(): void {
    if (this.gifData.viewUrl)
    this.Subscriptions.push(
      this.appService
        .downloadGIF(this.gifData.viewUrl)
        .subscribe((data) => {
          const blob: any = new Blob([data], { type: 'image/gif' });
          filesaver.saveAs(blob, this.imageTitleLong ? this.imageTitleLong : '');
        })
    );
  }
  /**
   * Save the selected GIF to the local storage.
   */
  saveGif(): void {
    if (this.imageTitleLong) 
    this.hasSavedImage = this.dbService.saveGIF(
      this.gifData,
      this.imageTitleLong
    );
  }
  /**
   * Close the dialog and emits value that isSave boolean.
   */
  closeDialog(): void {
    this.dialogRef.close(
      {
        isSave: this.hasSavedImage
      }
    );
  }
  /**
   * Remove the selected GIF from the local storage.
   */
  removeGIF(): void {
    this.hasSavedImage = this.dbService.removeGIF(this.gifData);
  }
  /**
   * 
   * @param event received from the image that did not load properly.
   * and displays as nothing.
   */
  checkifload(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.Subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
