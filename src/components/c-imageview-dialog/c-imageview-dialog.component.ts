import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IGiphyData } from 'src/models/giphy-interface';

@Component({
  selector: 'app-c-imageview-dialog',
  templateUrl: './c-imageview-dialog.component.html',
  styleUrls: ['./c-imageview-dialog.component.sass'],
})
export class CImageviewDialogComponent {
  gifReceiveData!: IGiphyData;
  imageCaption!: string;
  imageOnload: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CImageviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public gifData: IGiphyData
  ) {
    this.gifReceiveData = gifData;
  }
  loaderTagStyle: any = {
    'background-color': '#e2e2e2',
    height: '200px',
    'border-radius': '0px',
    width: '300px', 
    margin: '0px',
 
  };
  ngOnInit(): void {
    this.imageCaption = this.titleShortener(
      this.gifReceiveData.title === ''
        ? this.gifReceiveData.username
        : this.gifReceiveData.username === '' ? this.gifReceiveData.slug : this.gifReceiveData.title);
  }
  titleShortener(title: string): string {
    if (title.length > 25) {
      return title.substring(0, 25) + '...';
    }else return title 
  }
  checkifload(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
