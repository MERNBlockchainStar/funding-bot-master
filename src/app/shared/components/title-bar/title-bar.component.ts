import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {
  @Input() title:string="";
  @Output() close=new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

  closeWindow(){
    this.close.emit();
  }
}
