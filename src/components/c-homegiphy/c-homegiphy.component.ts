import { Component, ElementRef, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-c-homegiphy',
  templateUrl: './c-homegiphy.component.html',
  styleUrls: ['./c-homegiphy.component.sass']
})
export class CHomegiphyComponent implements OnInit {

  defaultDisplay: boolean = false;
  constructor(
    private appService: AppService
  )
  {}

  ngOnInit(): void {
    
    const getDefaultView: string | null = this.appService.tempGetKey('pagecountview');
    this.defaultDisplay =  getDefaultView === "1" ? true : false;
  }
 
}
 

