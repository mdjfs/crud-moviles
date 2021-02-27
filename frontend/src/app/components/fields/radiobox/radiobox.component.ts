import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radiobox',
  templateUrl: './radiobox.component.html',
  styleUrls: ['./radiobox.component.scss'],
})
export class RadioboxComponent implements OnInit {

  @Input() question: string;
  @Input() options: string[];
  @Output() answered =  new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  setAnswer(answer: string){
    this.answered.emit(answer);
  }

}
