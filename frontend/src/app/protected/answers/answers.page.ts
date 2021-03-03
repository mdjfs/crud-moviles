import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
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

  constructor(private resultService: ResultService, private modalController: ModalController, private alertController: AlertController,
    private authService: AuthService, private router: Router, private errorService: ErrorService) {
    if(this.authService.getUser().role !== "admin") this.router.navigate(["/menu"])
  }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    await this.loadResults();
  }

  async delete(resultId: string){
    const result = this.results.filter(result => result.id == resultId);
    if(result.length > 0){
      const alert = await this.alertController.create({
        header: `Are you sure to delete ${result[0].name}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          }, {
            text: 'Delete',
            handler: () => {
              this.loading = true;
              this.resultService.deleteResult({id: result[0].id}).subscribe(
                () => this.loadResults(),
                (error) => this.errorService.displayError(error.message, [{name: "reload", callback: () => window.location.reload()}])
              ).add(() => this.loading = false)
            }
          }
        ]
      });

      await alert.present();
    }
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
      this.errorService.displayError(e.message, [{name: "reload", callback: () => window.location.reload()}])
    }
  }

}
