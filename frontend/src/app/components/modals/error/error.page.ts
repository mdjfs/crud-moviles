import { Component, Input, OnInit } from '@angular/core';

export interface ErrorHandler{
  name: string,
  callback: Function
}

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {

  @Input() handlers: ErrorHandler[];
  @Input() error: string;

  constructor() { }

  ngOnInit() {
  }

}
