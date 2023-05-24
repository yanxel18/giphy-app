import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class CImagethumbnailComponent implements OnInit {
  @Input() InGIFData!: IGiphyData; 
  // @Output() OutImageError = new EventEmitter<any>();
  GifNodeData!: Observable<IGiphyData>;
  
  imageCaption!: string;
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
  ngOnInit() {
    this.imageCaption = this.titleShortener(
      this.InGIFData.title === ''
        ? this.InGIFData.username
        : this.InGIFData.username === '' ? this.InGIFData.slug : this.InGIFData.title);
  }
  titleShortener(title: string): string {
    if (title.length > 25) {
      return title.substring(0, 25) + '...';
    }else return title 
  }
  loadGifNode(): void {
    this.GifNodeData = this.appService.nodeGIF(this.InGIFData.id).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
