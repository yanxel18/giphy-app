import { MediaMatcher } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [Title, AppService],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'GIF Suki!';
  @ViewChild('bodycontainer', { read: ElementRef })
  bodycontainer!: ElementRef<HTMLElement>;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private apptitle: Title,
    private appService: AppService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  /**
   * initialized title
   */
  ngOnInit(): void {
    this.apptitle.setTitle(this.title);
  }
  applyScroll(): void {
    const scrollVal = this.appService.tempGetKey('_scroll');
    if (typeof scrollVal === 'string')
      this.bodycontainer.nativeElement.scrollTop = +scrollVal;
  }

  onScroll(): void {
    this.appService.tempStoreKey(
      '_scroll',
      this.bodycontainer.nativeElement.scrollTop.toString()
    );
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.applyScroll();
    }, 1);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
