import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { FormService } from 'src/app/services/form.service';
import { ResultData, ResultService } from 'src/app/services/result.service';
import { AnswerDetailPage } from './answer-detail/answer-detail.page';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.page.html',
  styleUrls: ['./answers.page.scss'],
})
export class AnswersPage implements OnInit {

  private loading: boolean = false;
  private results: ResultData[] = [];

  constructor(private resultService: ResultService, private modalController: ModalController, private authService: AuthService, private router: Router, private errorService: ErrorService) {
    if(this.authService.getUser().role !== "admin") this.router.navigate(["/menu"])
  }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    await this.loadResults();
  }

  async open(resultId: string) {
    const result = this.results.filter(result => result.id == resultId);
    if(result.length > 0){
      const modal = await this.modalController.create({
        component: AnswerDetailPage,
        componentProps: {
          'result': result[0]
        }
      });
      return await modal.present();
    }
  }

  async loadResults(){
    this.loading = true;
    try{
      const results = await this.resultService.getResult({}).toPromise();
      this.results = results;
      this.loading = false;
    }catch(e){
      this.errorService.displayError(e.toString(), [{name: "reload", callback: window.location.reload}])
    }
  }

}
