import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { FormService, FormData } from 'src/app/services/form.service';
import { ResultService, ResultData } from 'src/app/services/result.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {

  answersCount: number = undefined;
  formsCount: number = undefined;
  forms: FormData[] = undefined;
  results: ResultData[] = undefined;
  filledPercentage: number = undefined;
  users = undefined;
  usersCount: number = undefined;

  constructor(private resultService: ResultService, private formService: FormService, private authService: AuthService, private router: Router, private errorService: ErrorService) {
    if(this.authService.getUser().role !== "admin") this.router.navigate(["/menu"])
  }

  async loadData(){
    try{
    const results = await this.resultService.getResult({}).toPromise();
    this.results = results;
    this.answersCount = results.length;
    const forms = await this.formService.getAllForms().toPromise();
    this.forms = forms;
    this.formsCount = forms.length ;
    const users = await this.authService.getAll().toPromise();
    this.users = users;
    this.usersCount = users.length ;
    this.loadStats();
    }catch(e){
      this.errorService.displayError(e.message, [{name: "reload", callback: () => window.location.reload()}])
    }
  }

  ionViewWillEnter(){
    this.loadData();
  }

  loadStats(){
    if(this.results && this.forms) {
      let totalFull = 0, total = 0;
      for(const form of this.forms){
        for(const answer of this.results){
          if(answer.formId == form.id){
            let full = true;
            for(const key of Object.keys(answer.result)){
              const sections = answer.result[key];
              for(const field of sections){
                console.log(field);
                if(! field.answer) full = false;
              }
            }
            total += 1;
            if(full) totalFull +=1;
          }
        }
      }
      const percentage =(totalFull/total * 100);
      this.filledPercentage = isNaN(percentage) ? 0 : parseInt(percentage.toFixed(0));
    }
  }

}
