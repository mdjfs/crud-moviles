import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {

  @Input() question: string;
  @Output() answered =  new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  setAnswer(value: string|number){
    this.answered.emit(value as string);
  }
}
