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
  constructor(
    public dialogRef: MatDialogRef<CImageviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public gifData: IGiphyData
  ) {
    this.gifReceiveData = gifData;
  }
  ngOnInit() {
    this.imageCaption =
      this.gifReceiveData.title === ''
        ? this.gifReceiveData.username
        : this.gifReceiveData.title;
  }
}
