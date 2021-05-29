import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-window',
  templateUrl: './main-wnd.component.html',
  styleUrls: ['./main-wnd.component.scss']
})
export class MainWndComponent implements OnInit {
  title:string="Exchanges Analyzer";

  constructor() { }

  ngOnInit(): void {
  }

  OnCloseWindow(): void {

  }
}
