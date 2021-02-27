import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit {



  @Input() question: string;
  @Output() answered =  new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {}

  setAnswer(checked: boolean){
    this.answered.emit(checked);
  }

}
