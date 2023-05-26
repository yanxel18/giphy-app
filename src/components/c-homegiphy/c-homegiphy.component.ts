import {
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
export class CHomegiphyComponent implements OnInit {
  defaultDisplay: boolean = false;
  @Output() OutRefreshSearch = new EventEmitter<any>();
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;
  @ViewChild(CSearchbarComponent)
  CSearchBar!: CSearchbarComponent;

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
  ngOnInit(): void {
    const getDefaultView: string | null =
      this.appService.tempGetKey('_default');
    this.defaultDisplay = getDefaultView === '1' ? true : false;
    this.getDatabase();
  }
  trackGIFIndex(index: number): number {
    return index;
  }
  sortGifByDate(order: number): void {
    this.gifResult.sort((a, b) => {
      if (a.savedate && b.savedate) {
        if (order === 0) return new Date(b.savedate).getTime() - new Date(a.savedate).getTime() ; 
        if (order === 1) return new Date(a.savedate).getTime() - new Date(b.savedate).getTime();
      }
      return 0;
    });
    this.appService.tempStoreKey('_tempDB', JSON.stringify(this.gifResult));
  }
  getDatabase(): void {
    this.gifResult = this.dbService.GifDB.map((item) => {
      return {
        ...item,
        download: 1,
      };
    });
  }

  searchCollections(): void {
    this.searchQuery = this.searchQuery.trim();
    if (this.searchQuery.length > 0) {
      this.gifResult = this.gifResult.filter((x) =>
        x.searchTags?.some((w) =>
          w.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    } else this.getDatabase();
  }

  refreshData(): void {
    this.getDatabase();
    this.OutRefreshSearch.emit();
  }

  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

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

  dragDropped(event: CdkDragDrop<number>): void {
    if (!this.dropListReceiverElement) {
      return;
    }
    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
}
