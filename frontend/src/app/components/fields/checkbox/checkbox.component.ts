import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {

  @Input() question: string;
  @Input() options: string[];
  @Output() answered =  new EventEmitter<string[]>();

  values: string[] = []

  constructor() { }

  ngOnInit() {}

  setAnswer(value: string, checked: boolean){
    if(!this.values.includes(value) && checked) this.values.push(value);
    if(this.values.includes(value) && !checked) this.values = this.values.filter(item => item != value);
    this.answered.emit(this.values);
  }
}
