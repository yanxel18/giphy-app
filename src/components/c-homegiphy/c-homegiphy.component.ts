import { Component, ElementRef, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-c-homegiphy',
  templateUrl: './c-homegiphy.component.html',
  styleUrls: ['./c-homegiphy.component.sass'],
  providers: [AppService]
})
export class CHomegiphyComponent implements OnInit {

  defaultDisplay: boolean = false;
  constructor(
    private appService: AppService
  )
  {}

  ngOnInit(): void {
    
    const getDefaultView: string | null = this.appService.tempGetKey('_default');
    this.defaultDisplay =  getDefaultView === "1" ? true : false;
  }
 
}
 

