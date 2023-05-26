import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import { IGifDB } from 'src/models/web-interface';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private appService: AppService) {}

  /**
   *
   */
  get GifDB(): IGifDB[] {
    const tempgifDB = this.appService.tempGetKey('_tempDB');
    const gifDB: IGifDB[] =
      typeof tempgifDB === 'string' ? JSON.parse(tempgifDB) : [];
    return gifDB;
  }
  /**
   *
   */
  get SearchTxt(): string {
    const getSearchQuery = this.appService.tempGetKey('_searchQuery');
    return getSearchQuery ? getSearchQuery : '';
  }
  /**
   *
   */
  getNewRowID(): number {
    const getDB: IGifDB[] = this.GifDB;
    return getDB.length > 0
      ?  getDB.sort((a, b) => {
          return b.rowID - a.rowID;
        })[0].rowID + 1
      : 1;
  }
  /**
   *
   * @param giphy
   * @param saveTitle
   * @returns
   */
  saveGIF(giphy: IGifDB, saveTitle: string): boolean {
    const getDB: IGifDB[] = this.GifDB;
    const newGIF: IGifDB = {
      rowID: this.getNewRowID(),
      id: giphy.id,
      title: saveTitle,
      viewUrl: giphy.viewUrl,
      viewThumbnail: giphy.viewThumbnail, 
      searchTags: [saveTitle, this.SearchTxt],
      savedate: moment().format('YYYY-MM-DD H:mm:ss ')
      
    };
    getDB.push(newGIF);
    this.appService.tempStoreKey('_tempDB', JSON.stringify(getDB));
    const checkData = getDB.filter((g) => g.rowID === newGIF.rowID);
    return checkData.length === 1;
  }
  /**
   *
   * @param giphy
   * @returns
   */
  removeGIF(giphy: IGifDB): boolean {
    let getDB: IGifDB[] = this.GifDB;
    getDB = getDB.filter((gif) => gif.id !== giphy.id);
    this.appService.tempStoreKey('_tempDB', JSON.stringify(getDB));
    const checkData = this.GifDB.filter((g) => g.id === giphy.id);
    return !(checkData.length === 0);
  }
  /**
   *
   * @param giphy
   * @returns
   */
  checkIfExist(giphy: IGifDB): boolean {
    let getDB: IGifDB[] = this.GifDB;
    getDB = getDB.filter((gif) => gif.id === giphy.id);
    return getDB.length > 0;
  }
}
