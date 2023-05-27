import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
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
   * @param imageData passed value from parent component on a specific array object.
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
   * @param event gets the event if the image does not load correctly.
   * it will be displayed as nothing.
   */
  checkifload(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
  /**
   * Initializes the Title of the browser.
   * this.hasSavedImage flag checks if the selected image is already existed in the storage
   * shade the collections button.
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
   * @param title received title to be shortened.
   * @returns the shortened title.
   */
  titleShortener(title: string | null): string | null {
    return this.appService.titleShortener(title);
  }
  /**
   * Saved the GIF to the local storage and emits after the save is complete.
   */
  saveGif(): void {
    if (this.imageTitleLong)
      this.hasSavedImage = this.dbService.saveGIF(
        this.InGIFData,
        this.imageTitleLong
      );
    this.OutSaveStatus.emit();
  }
  /**
   *Removes the GIF from the local storage.
   * and emits after the remove is complete.
   */
  removeGIF(): void {
    this.hasSavedImage = this.dbService.removeGIF(this.InGIFData);
    this.OutSaveStatus.emit();
  }
  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.Subscription.forEach((sub) => sub.unsubscribe());
  }
}
