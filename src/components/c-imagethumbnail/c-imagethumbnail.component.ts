import {
  Component, 
  EventEmitter, 
  Input,
  OnDestroy,
  OnInit,
  Output, 
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service'; ;
import { MatDialog } from '@angular/material/dialog';
import { CImageviewDialogComponent } from '../c-imageview-dialog/c-imageview-dialog.component';
import { DbService } from 'src/dbservice/db.service';
import { ICloseImageDialog, IGifDB } from 'src/models/web-interface';
 
@Component({
  selector: 'app-c-imagethumbnail',
  templateUrl: './c-imagethumbnail.component.html',
  styleUrls: ['./c-imagethumbnail.component.sass'],
  providers: [AppService, DbService],
})
export class CImagethumbnailComponent implements OnInit, OnDestroy {
  @Input() InGIFData!: IGifDB;
  @Output() OutSaveStatus = new EventEmitter<any>();

  hasSavedImage: boolean = false;
  imageTitleShort: string | null = null;
  imageTitleLong: string | null = null;
  Subscription: Subscription[] = [];
  constructor(
    private appService: AppService,
    private dbService: DbService,
    private viewGIFDialog: MatDialog
  ) {}
  /**
   *
   * @param imageData
   */
  showImage(imageData: IGifDB): void {  
    const dialog = this.viewGIFDialog.open(CImageviewDialogComponent, {
      disableClose: true,
      minWidth: '300px',
      minHeight: '200px',
      data: imageData,
    });
    this.Subscription.push(
      dialog.afterClosed().subscribe((result: ICloseImageDialog) => {
        if (result) { 
            result.isSave
            ? (this.hasSavedImage = true)
            : (this.hasSavedImage = false); 
            this.OutSaveStatus.emit();
        }  
      })
    );
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
    const newtitle =
      this.InGIFData.title === ''
        ? this.InGIFData.username
        : this.InGIFData.username === ''
        ? this.InGIFData.slug
        : this.InGIFData.title;
    this.imageTitleLong = newtitle ? newtitle : '';
    this.imageTitleShort = this.titleShortener(this.imageTitleLong);
    this.hasSavedImage = this.dbService.checkIfExist(this.InGIFData);
  
  }
  /**
   *
   * @param title
   * @returns
   */
  titleShortener(title: string | null): string | null {
    return this.appService.titleShortener(title);
  }
  saveGif(): void {
    if (this.imageTitleLong)
      this.hasSavedImage = this.dbService.saveGIF(
        this.InGIFData,
        this.imageTitleLong
      );
      this.OutSaveStatus.emit();
  }
  /**
   *
   */
  removeGIF(): void {
    this.hasSavedImage = this.dbService.removeGIF(this.InGIFData);
    this.OutSaveStatus.emit();
  }
  /**
   *
   */
  // loadGifNode(): void {
  //   this.GifNodeData = this.appService.nodeGIF(this.InGIFData.id).pipe(
  //     map((data) => {
  //       return data;
  //     })
  //   );
  // }
  ngOnDestroy(): void {
    this.Subscription.forEach((sub) => sub.unsubscribe());
  }
}
