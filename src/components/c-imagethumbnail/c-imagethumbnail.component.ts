import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import { MatDialog } from '@angular/material/dialog';
import { CImageviewDialogComponent } from '../c-imageview-dialog/c-imageview-dialog.component';
import { DbService } from 'src/dbservice/db.service';
import { ICloseImageDialog } from 'src/models/web-interface';
@Component({
  selector: 'app-c-imagethumbnail',
  templateUrl: './c-imagethumbnail.component.html',
  styleUrls: ['./c-imagethumbnail.component.sass'],
  providers: [AppService,DbService],
})
export class CImagethumbnailComponent implements OnInit, OnDestroy {
  @Input() InGIFData!: IGiphyData; 
  // @Output() OutImageError = new EventEmitter<any>();
  GifNodeData!: Observable<IGiphyData>;
  hasSavedImage: boolean = false;
  imageTitleShort!: string;
  imageTitleLong!: string;
  Subscription: Subscription [] = []
  constructor(private appService: AppService,
    private dbService: DbService,
    private viewGIFDialog: MatDialog) {}
  /**
   * 
   * @param imageData 
   */
  showImage(imageData: IGiphyData): void {
    const dialog = this.viewGIFDialog.open(CImageviewDialogComponent, {
      disableClose: true,
      minWidth: '300px',
      minHeight: '200px', 
      data: imageData
    }); 
    this.Subscription.push(dialog.afterClosed().subscribe( (result: ICloseImageDialog)=> {
      if (result)  result.isSave  ? this.hasSavedImage = true : this.hasSavedImage = false;
      
    }));
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
  ngOnInit(): void {
    this.imageTitleLong =
      this.InGIFData.title === ''
        ? this.InGIFData.username
        : this.InGIFData.username === ''
        ? this.InGIFData.slug
        : this.InGIFData.title;
    this.imageTitleShort = this.titleShortener(this.imageTitleLong);
    this.hasSavedImage = this.dbService.checkIfExist(this.InGIFData);
  } 
  /**
   * 
   * @param title 
   * @returns 
   */
  titleShortener(title: string): string {
    return this.appService.titleShortener(title);
  }
  saveGif(): void {
    this.hasSavedImage = this.dbService.saveGIF(
      this.InGIFData,
      this.imageTitleLong
    );
  }
  /**
   * 
   */
  removeGIF(): void {
    this.hasSavedImage = this.dbService.removeGIF(this.InGIFData);
  }
  /**
   * 
   */
  loadGifNode(): void {
    this.GifNodeData = this.appService.nodeGIF(this.InGIFData.id).pipe(
      map((data) => {
        return data;
      })
    );
  }
  ngOnDestroy(): void {
    this.Subscription.forEach((sub) => sub.unsubscribe());
  }
}
