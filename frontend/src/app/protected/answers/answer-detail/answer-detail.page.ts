import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { findIndex } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { ResultData } from 'src/app/services/result.service';

export interface ResultDetail{
  section: string,
  answers: ResultField[]
}

export interface ResultField{
  answer: string[]|string|boolean,
  options?: string[],
  question: string
}

@Component({
  selector: 'app-answer-detail',
  templateUrl: './answer-detail.page.html',
  styleUrls: ['./answer-detail.page.scss'],
})
export class AnswerDetailPage  {

  @Input() result: ResultData;

  details: ResultDetail[] = [];
  loading: boolean = false;

  constructor(private modalCtrl: ModalController, private errorService: ErrorService) { }


  ionViewWillEnter(){
    this.loadResult();
  }

  loadResult(){
    try{

      this.loading = true;
      const findIndex = (key: string) => parseInt(key.split(",")[0])
      this.details = Object.keys(this.result.result).sort((a, b) => findIndex(a) - findIndex(b)).map(key => ({section: key.split(",")[1], answers: this.result.result[key]}));
      this.loading = false;
    }catch(e){
      this.errorService.displayError(e.toString(), [{name: "Go back", callback: this.dismiss.bind(this)}])
    }
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  parseResult(result: string[]|string|boolean){
    if(Array.isArray(result) && result.length > 0) return result.join(",");
    else if(typeof result == "boolean") return result ? "Yes" : "No"
    else if(result == undefined || result.length == 0) return "Not filled."
    else return result;
  }
}
