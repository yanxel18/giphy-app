import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import { IAPIParam } from 'src/models/web-interface';

@Component({
  selector: 'app-c-searchbar',
  templateUrl: './c-searchbar.component.html',
  styleUrls: ['./c-searchbar.component.sass'],
  providers: [AppService],
})
export class CSearchbarComponent implements OnInit, AfterViewInit {
  constructor(private appService: AppService) {}
  @ViewChild('searchbar') searchbar!: ElementRef<HTMLInputElement>;

  searchQuery: string = "";
  searchOrTrend: boolean = false;
  searchLimit: number = 10;
  searchOffset: number = 0;
  gifResult!: Observable<IGiphyData[]>;
  ngOnInit() {
    this.initializePage();
  }

  initializePage(): void {
    const getSearchOrTrend: string | null =
      this.appService.tempGetKey('_searchType');
    const getSearchQuery = this.appService.tempGetKey('_searchQuery');
    this.searchOrTrend = getSearchOrTrend === '1' ? true : false;
    this.searchQuery = getSearchQuery ? getSearchQuery : "";
    this.changeSearchResult(this.searchOrTrend);
  }
  changeSearchResult(changeSearch: boolean): void {
    changeSearch ? this.searchGif() : this.searchTrendingGif();
  }
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height 
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.searchLimit = this.searchLimit + 2;
      this.searchGif();

      console.log("End");
    }
}
  /**
   * Search for GIF images based on a search term.
   */
  searchGif(): void {
    this.appService.tempStoreKey('_searchType', '1');
    this.searchOrTrend = true; 
    if (typeof this.searchQuery === 'string') {
      this.searchQuery = this.searchQuery!.trim();
      if (!this.searchQuery) this.searchTrendingGif();
      else {
        this.appService.tempStoreKey('_searchhQuery', this.searchQuery);
        const searchParam: IAPIParam = {
          query: this.searchQuery,
          offset: this.searchOffset,
          limit: this.searchLimit,
          rating: 'g',
          language: 'en',
        };
        this.gifResult = this.appService
          .searchGif(searchParam)
          .pipe(map((res) => res.data));
      }
    }
  }
  /**
   * Initial display of trending GIFs.
   */
  searchTrendingGif(): void {
    this.appService.tempStoreKey('_searchType', '0');
    this.searchOrTrend = false;
    const trendingGifParam: Partial<IAPIParam> = {
      offset: this.searchOffset,
      limit: this.searchLimit,
      rating: 'g',
      language: 'en',
    };
    this.gifResult = this.appService
      .trendingGif(trendingGifParam)
      .pipe(map((res) => res.data));
  }
  /**
   *
   * @param index value received from trackBy index
   * @returns unique id of the GIF being generated using trackBy
   */
  trackGIFIndex(index: number): number {
    return index;
  }
  /**
   * Put the cursor to the search bar.
   */
  ngAfterViewInit(): void {
    setTimeout(() => this.searchbar.nativeElement.focus(), 0);
  }
}
