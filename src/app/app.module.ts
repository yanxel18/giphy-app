import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CSearchbarComponent } from 'src/components/c-searchbar/c-searchbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModules } from 'src/material-modules/material-modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CHomegiphyComponent } from 'src/components/c-homegiphy/c-homegiphy.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CImagethumbnailComponent } from 'src/components/c-imagethumbnail/c-imagethumbnail.component';
import { CImageviewDialogComponent } from 'src/components/c-imageview-dialog/c-imageview-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CSearchbarComponent,
    CHomegiphyComponent,
    CImagethumbnailComponent,
    CImageviewDialogComponent
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModules,
    FormsModule,
    ReactiveFormsModule, 
    NgxSkeletonLoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
