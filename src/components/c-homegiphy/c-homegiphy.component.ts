import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { DbService } from 'src/dbservice/db.service';
import { IGiphyData } from 'src/models/giphy-interface';
import { IGifDB, ISkeletonLoader } from 'src/models/web-interface';
import { CSearchbarComponent } from '../c-searchbar/c-searchbar.component';
import {
  CdkDragEnter,
  moveItemInArray,
  CdkDragMove,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-c-homegiphy',
  templateUrl: './c-homegiphy.component.html',
  styleUrls: ['./c-homegiphy.component.sass'],
  providers: [AppService, DbService],
})
export class CHomegiphyComponent implements OnInit, AfterViewInit {
  @Output() OutRefreshSearch = new EventEmitter<any>();
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;
  @ViewChild(CSearchbarComponent)
  CSearchBar!: CSearchbarComponent;
  searchFlag: boolean = false;
  gifResult: IGifDB[] = [];
  searchQuery: string = '';
  constructor(private appService: AppService, private dbService: DbService) {}
  loaderStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '200px',
    'border-radius': '4px',
    width: '236px',
    'margin-top': '4px',
    'margin-bottom': '4px',
    'margin-left': '4px',
    'margin-right': '8px',
  };
  /**
   * Initialized database from storage
   */
  ngOnInit(): void {
    this.getDatabase();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const searchQ: string | null =
        this.appService.tempGetKey('_searchCollection');
      if (typeof searchQ === 'string') {
        this.searchQuery = searchQ;
        this.searchCollections();
      } else this.searchQuery = '';
    }, 0);
  }
  /**
   * Track GIF and giving unique ID for each loop to prevent memory leaks
   */
  trackGIFIndex(index: number): number {
    return index;
  }
  /**
   *
   * @param order if 0 = news to oldest, if 1 = oldest to newest by date added
   */
  sortGifByDate(order: number): void {
    this.getDatabase();
    this.gifResult.sort((a, b) => {
      if (a.savedate && b.savedate) {
        if (order === 0)
          return (
            new Date(b.savedate).getTime() - new Date(a.savedate).getTime()
          );
        if (order === 1)
          return (
            new Date(a.savedate).getTime() - new Date(b.savedate).getTime()
          );
      }
      return 0;
    });
    this.appService.tempStoreKey('_tempDB', JSON.stringify(this.gifResult));
    if (this.searchFlag) this.searchCollections();
  }
  /**
   * Retrive database from DBservice locastorage and set dowload=1 to
   * enable download button on dialog view.
   */
  getDatabase(): void {
    this.gifResult = this.dbService.GifDB.map((item) => {
      return {
        ...item,
        download: 1,
      };
    });
  }
  /**
   * Trigger searching functions by keyword using 'searchQuery' parameter.
   * The search is using the searchTag node in the JSON object of gifResult variable.
   */
  searchCollections(): void {
    this.searchQuery = this.searchQuery.trim();
    if (this.searchQuery.length > 0) {
      this.searchFlag = true;
      this.appService.tempStoreKey('_searchCollection', this.searchQuery);
      this.getDatabase();
      this.gifResult = this.gifResult.filter((x) =>
        x.searchTags?.some((w) =>
          w.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    } else {
      this.getDatabase();
      this.appService.tempStoreKey('_searchCollection', this.searchQuery);
      this.searchFlag = false;
    }
  }
  /**
   *  Refresh data from retrieving again from the DBService and emit to OutRefreshSearch.
   * to trigger the changes from the imagethumbnail component.
   */
  refreshData(): void {
    if (!this.searchFlag) {
      this.getDatabase();
      this.OutRefreshSearch.emit();
    } else {
      this.getDatabase();
      this.OutRefreshSearch.emit();
      this.searchCollections();
    }
  }
  /**
   * Clearing the text input search box and save the state of the search box to local storage.
   */
  clearSearchInput(): void {
    this.searchQuery = '';
    this.appService.tempStoreKey('_searchCollection', this.searchQuery);
    this.searchCollections();
  }
  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };
  /**
   *
   * @param event From dragEntered method. This triggers after the drop image has been completed.
   * The new database order will be saved to local storage.
   */
  dragEntered(event: CdkDragEnter<number>): void {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');

    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);

      moveItemInArray(this.gifResult, dragIndex, dropIndex);
      this.appService.tempStoreKey('_tempDB', JSON.stringify(this.gifResult));
    }
  }
  /**
   *
   *  The dragmove method is called when the user moves the mouse over a drop zone.
   */
  dragMoved(): void {
    if (!this.dropListContainer || !this.dragDropInfo) return;

    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        '.cdk-drag-placeholder'
      );

    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement?.nextElementSibling
        : placeholderElement?.previousElementSibling;

    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }
  /**
   *
   * @param event  pass from CDKdragdrop.
   * @returns index of the dragged item.
   */
  dragDropped(event: CdkDragDrop<number>): void {
    if (!this.dropListReceiverElement) {
      return;
    }
    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
}
