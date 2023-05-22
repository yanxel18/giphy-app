import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { IGiphyData } from 'src/models/giphy-interface';
import { IAPIParam, ISkeletonLoader } from 'src/models/web-interface';

@Component({
  selector: 'app-c-searchbar',
  templateUrl: './c-searchbar.component.html',
  styleUrls: ['./c-searchbar.component.sass'],
  providers: [AppService],
})
export class CSearchbarComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private appService: AppService) {}
  @ViewChild('searchbar') searchbar!: ElementRef<HTMLInputElement>;
  @ViewChild('trendingWords') trendingWords!: ElementRef<HTMLElement>;
  MAX_SEARCH_LIMIT: number = 5;
  searchResultCount: number = 0;
  Subscriptions: Subscription[] = [];
  searchQuery: string = '';
  searchOrTrend: boolean = false;
  searchLimit: number = 24;
  searchOffset: number = 0;
  searchTrendingWords!: Observable<string[]>;
  gifResult: IGiphyData[] = [];
  skeletonLoader: number[] = [this.searchLimit];
  hideSearchMore: boolean = true;

  ngOnInit() {
    this.initializePage();
  }
 
  loaderTagStyle: any = {
    'background-color': '#e2e2e2',
    height: '40px',
    'border-radius': '20px',
    width: '89px', 
    'margin-left': '2px',
    'margin-right': '2px',
  };
  loaderStyle: any = {
    'background-color': '#e2e2e2',
    height: '200px',
    'border-radius': '16px',
    width: '236px',
    'margin-top': '4px',
    'margin-bottom': '4px',
    'margin-left': '4px',
    'margin-right': '8px',
  };
  /**
   *
   */
  initializePage(): void {
    const getSearchOrTrend: string | null =
      this.appService.tempGetKey('_searchType');
    const getSearchQuery = this.appService.tempGetKey('_searchQuery');
    const getSearchOffset = this.appService.tempGetKey('_searchOffset');
    this.searchOrTrend = getSearchOrTrend === '1' ? true : false;
    this.searchQuery = getSearchQuery ? getSearchQuery : '';
    this.searchOffset = getSearchOffset ? +getSearchOffset : 0;
    this.changeSearchResult(this.searchOrTrend);

  }

  getTrendingWords(): void {
 
    this.searchTrendingWords = this.appService.trendingWordsUrl().pipe(
      map((data) => {
        return data;
      })
    );
  }
  /**
   *
   * @param changeSearch
   */
  changeSearchResult(changeSearch: boolean): void {
    this.getTrendingWords()
    changeSearch ? this.searchGif() : this.searchTrendingGif();
  }
  /**
   *
   */
  loadMoreGif(): void {
    const OFFSET_ADDITIONAL = 24;
    this.searchOffset = this.searchOffset + OFFSET_ADDITIONAL;
    this.appService.tempStoreKey('_searchOffset', this.searchOffset.toString());
    this.Subscriptions.map((subscription) => subscription.unsubscribe());
    this.searchOrTrend ? this.getSearchResult() : this.getSearchTrendResult();
  }

  scrollRight(): void {
    this.trendingWords.nativeElement.scrollLeft +=200;
  }
  scrollLeft(): void {
    this.trendingWords.nativeElement.scrollLeft -=200;
  }


  /**
   *
   */
  get searchParamValue(): IAPIParam {
    const searchParam: IAPIParam = {
      query: this.searchQuery,
      offset: this.searchOffset,
      limit: this.searchLimit,
      rating: 'g',
      language: 'en',
    };
    return searchParam;
  }
  /**
   *
   */
  getSearchResult(): void {
    this.Subscriptions.map((subscription) => subscription.unsubscribe());
    if (typeof this.searchQuery === 'string') {
      this.searchQuery = this.searchQuery!.trim();
      if (!this.searchQuery) this.searchTrendingGif();
      else {
        this.appService.tempStoreKey('_searchQuery', this.searchQuery);
        this.Subscriptions.push(
          this.appService.searchGif(this.searchParamValue).subscribe((data) => {
            if (data) {
              this.gifResult = this.gifResult.concat(data.data);
              this.searchResultCount = data.pagination.total_count;
              this.hideSearchMore = false;
            }
          })
        );
      }
    }
  }
  /**
   *
   */
  getSearchTrendResult(): void { 
    this.Subscriptions.push(
      this.appService.trendingGif(this.searchParamValue).subscribe((data) => {
        if (data) { 
          this.gifResult = this.gifResult.concat(data.data);
          this.hideSearchMore = false;
          this.searchResultCount = data.pagination.total_count;
        }
      })
    );
  }
  /**
   * Search for GIF images based on a search term.
   */
  searchGif(): void {
    this.appService.tempStoreKey('_searchType', '1');
    this.appService.tempStoreKey('_searchOffset', '0');
    this.searchOffset = 0;
    this.searchOrTrend = true;
    this.Subscriptions.map((subscription) => subscription.unsubscribe());
    this.gifResult = [];
    this.getSearchResult();
    this.getTrendingWords();
  }
  /**
   * Initial display of trending GIFs.
   */
  searchTrendingGif(): void {
    this.appService.tempStoreKey('_searchType', '0');
    this.appService.tempStoreKey('_searchQuery', '');
    this.searchOrTrend = false;

    this.getSearchTrendResult();
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
    setTimeout(() => {
      this.searchbar.nativeElement.value = this.searchQuery;
      this.searchbar.nativeElement.focus();
    }, 0);
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
  ngOnDestroy() {
    this.Subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
