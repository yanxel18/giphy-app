import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import * as filesaver from 'file-saver';
import { Subscription } from 'rxjs';
import { DbService } from 'src/dbservice/db.service';
import { ISkeletonLoader } from 'src/models/web-interface';
@Component({
  selector: 'app-c-imageview-dialog',
  templateUrl: './c-imageview-dialog.component.html',
  styleUrls: ['./c-imageview-dialog.component.sass'],
  providers: [AppService, DbService],
})
export class CImageviewDialogComponent implements OnInit, OnDestroy {
  gifReceiveData!: IGiphyData;
  imageTitleShort!: string;
  imageTitleLong!: string;
  imageOnload: boolean = false;
  Subscriptions: Subscription[] = [];
  defaultDisplay: boolean = false;
  hasSavedImage: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CImageviewDialogComponent>,
    private appService: AppService,
    private dbService: DbService,
    @Inject(MAT_DIALOG_DATA) public gifData: IGiphyData
  ) {
    this.gifReceiveData = gifData;
    const getDefaultView: string | null =
      this.appService.tempGetKey('_default');
    this.defaultDisplay = getDefaultView === '1' ? true : false;
  }
  loaderTagStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '200px',
    'border-radius': '0px',
    width: '300px',
    margin: '0px',
  };
  /**
   * 
   */
  ngOnInit(): void {
    this.imageTitleLong =
      this.gifReceiveData.title === ''
        ? this.gifReceiveData.username
        : this.gifReceiveData.username === ''
        ? this.gifReceiveData.slug
        : this.gifReceiveData.title;
    this.imageTitleShort = this.titleShortener(this.imageTitleLong);
    this.hasSavedImage = this.dbService.checkIfExist(this.gifReceiveData);
  }
  /**
   * 
   * @param title 
   * @returns 
   */
  titleShortener(title: string): string {
    return this.appService.titleShortener(title);
  }
  /**
   * 
   */
  downloadGIF(): void {
    this.Subscriptions.push(
      this.appService
        .downloadGIF(this.gifData.images.original.url)
        .subscribe((data) => {
          const blob: any = new Blob([data], { type: 'image/gif' });
          filesaver.saveAs(blob, this.imageTitleLong);
        })
    );
  }
  /**
   * 
   */
  saveGif(): void {
    this.hasSavedImage = this.dbService.saveGIF(
      this.gifData,
      this.imageTitleLong
    );
  }
  /**
   * 
   */
  removeGIF(): void {
    this.hasSavedImage = this.dbService.removeGIF(this.gifData);
  }
  /**
   * 
   * @param event 
   */
  checkifload(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
  /**
   * 
   */
  ngOnDestroy(): void {
    this.Subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
