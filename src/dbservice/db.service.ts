import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import { IGifDB } from 'src/models/web-interface';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private appService: AppService) {}

  get GifDB(): IGifDB[] {
    const tempgifDB = this.appService.tempGetKey('_tempDB');
    const gifDB: IGifDB[] =
      typeof tempgifDB === 'string' ? JSON.parse(tempgifDB) : [];
    return gifDB;
  }

  get SearchTxt(): string {
    const getSearchQuery = this.appService.tempGetKey('_searchQuery');
    return getSearchQuery ? getSearchQuery : '';
  }

  getNewRowID(): number {
    const getDB: IGifDB[] = this.GifDB;
    return getDB.length > 0
      ? getDB.sort((a, b) => {
          return b.rowID - a.rowID;
        })[0].rowID + 1
      : 1;
  }
  saveGIF(giphy: IGiphyData, saveTitle: string): boolean {
    const getDB: IGifDB[] = this.GifDB;
    const newGIF: IGifDB = {
      rowID: this.getNewRowID(),
      imageID: giphy.id,
      saveTitle: saveTitle,
      viewUrl: giphy.images.original.url,
      viewThumbnail: giphy.images.fixed_width.webp,
      searchTags: [saveTitle, this.SearchTxt],
    };
    getDB.push(newGIF);
    this.appService.tempStoreKey('_tempDB', JSON.stringify(getDB));
    const checkData = getDB.filter((g) => g.rowID === newGIF.rowID);
    return checkData.length === 1;
  }

  removeGIF(giphy: IGiphyData): boolean {
    let getDB: IGifDB[] = this.GifDB;
    getDB = getDB.filter((gif) => gif.imageID !== giphy.id);
    this.appService.tempStoreKey('_tempDB', JSON.stringify(getDB));
    const checkData = this.GifDB.filter((g) => g.imageID === giphy.id);
    return !(checkData.length === 0);
  }

  checkIfExist(giphy: IGiphyData): boolean {
    let getDB: IGifDB[] = this.GifDB;
    getDB = getDB.filter((gif) => gif.imageID === giphy.id);
    return getDB.length > 0;
  }
}
