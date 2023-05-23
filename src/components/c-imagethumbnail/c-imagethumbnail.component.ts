import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import { MatDialog } from '@angular/material/dialog';
import { CImageviewDialogComponent } from '../c-imageview-dialog/c-imageview-dialog.component';
@Component({
  selector: 'app-c-imagethumbnail',
  templateUrl: './c-imagethumbnail.component.html',
  styleUrls: ['./c-imagethumbnail.component.sass'],
  providers: [AppService],
})
export class CImagethumbnailComponent {
  @Input() InGIFData!: IGiphyData;
  // @Output() OutImageError = new EventEmitter<any>();
  GifNodeData!: Observable<IGiphyData>;
  

  constructor(private appService: AppService,
    private viewGIFDialog: MatDialog) {}
  showImage(imageData: IGiphyData): void {
    this.viewGIFDialog.open(CImageviewDialogComponent, {
      disableClose: false,
      minWidth: '300px',
      minHeight: '200px', 
      data: imageData
    }); 
  }
  checkifload(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
 
  loadGifNode(): void {
    this.GifNodeData = this.appService.nodeGIF(this.InGIFData.id).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
