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
  public gitResultCopy: any = [];
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
  getDatabase(): void {
    this.gifResult = this.dbService.GifDB.map((item) => {
      return {
        ...item,
        download: 1,
      };
    });
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

  dragMoved(event: CdkDragMove<number>): void {
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
