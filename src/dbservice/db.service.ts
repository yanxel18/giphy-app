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
   * Get all the stored GIFS from local storage.
   */
  get GifDB(): IGifDB[] {
    const tempgifDB = this.appService.tempGetKey('_tempDB');
    const gifDB: IGifDB[] =
      typeof tempgifDB === 'string' ? JSON.parse(tempgifDB) : [];
    return gifDB;
  }
  /**
   * Get last searchtext key from local storage
   */
  get SearchTxt(): string {
    const getSearchQuery = this.appService.tempGetKey('_searchQuery');
    return getSearchQuery ? getSearchQuery : '';
  }
  /**
   * Generate new ID from the last stored GIFs data. If the
   * localstorage is empty, generate a new ID.
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
   * @param giphy received the selected GIF Data object.
   * @param saveTitle received the title of the GIF.
   * @returns true if the GIF was saved, false otherwise.
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
   * @param giphy received the selected GIF Data object to be deleted.
   * @returns true if the GIF was deleted, false otherwise.
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
   * @param giphy received data to be checked.
   * @returns true if the GIF was existing, false otherwise.
   */
  checkIfExist(giphy: IGifDB): boolean {
    let getDB: IGifDB[] = this.GifDB;
    getDB = getDB.filter((gif) => gif.id === giphy.id);
    return getDB.length > 0;
  }
}
