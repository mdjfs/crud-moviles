import { Component, OnInit } from '@angular/core';
import { FormService, FormData } from 'src/app/services/form.service';
import { ResultService, ResultData } from 'src/app/services/result.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  answersCount: number = undefined;
  formsCount: number = undefined;
  forms: FormData[] = undefined;
  results: ResultData[] = undefined;
  formsFilled: string = undefined;
  users = undefined;
  usersCount: number = undefined;

  constructor(private resultService: ResultService, private formService: FormService, private userService: UserService) { }

  ngOnInit() {
    this.resultService.getResult({}).subscribe(
      (result: ResultData[]) => {
        this.results = result;
        this.answersCount = result.length+1;
        this.loadStats();
      }
    )
    this.formService.getAllForms().subscribe(
      (result: FormData[]) => {
        this.forms = result;
        this.formsCount = result.length+1;
        this.loadStats();
      }
    )
    this.userService.getAll().subscribe(
      (result) => {
        this.users = result;
        this.usersCount = result.length+1;
        this.loadStats();
      }
    )
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
                if(! field.answer) full = false;
              }
            }
            total += 1;
            if(full) totalFull +=1;
          }
        }
      }
      this.formsFilled = `${(totalFull/total * 100).toFixed(0)}%`;
    }
  }

}
