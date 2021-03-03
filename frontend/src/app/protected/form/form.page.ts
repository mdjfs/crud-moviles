import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {MenuData, MenuService} from '../../services/menu.service'
import {FormData, SectionData,  FormService} from '../../services/form.service';
import { UserService, UserData } from 'src/app/services/user.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NewFieldPage } from './new-field/new-field.page';
import { ResultService } from 'src/app/services/result.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ErrorHandler } from 'src/app/components/modals/error/error.page';


interface SectionAnswer{
  [key: string]: Answer[]
}

interface Answer{
  question: string,
  options?: string[],
  answer?: string[]|string|boolean
}

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss']
})
export class FormPage implements OnInit {

  testQuestion: string = "Eres veneco?";
  testOptions: string[] = ["parcialmente", "tal vez si", "bueno no se"]

  menu: MenuData = undefined;
  sections: SectionData[] = []
  form: FormData = {
    name: "",
    description: "",
    sections: []
  };
  user: UserData = undefined;
  isAdmin: boolean = false;
  isNewForm: boolean = undefined;
  sendingAnswer: boolean = false;

  answers: SectionAnswer = {};
  loading: boolean = false;
  generalHandlers: ErrorHandler[] = undefined;

  constructor(private menuService: MenuService, private activatedRoute: ActivatedRoute, private authService: AuthService,
    private modalController: ModalController, private router: Router,
    private alertController: AlertController, private formService: FormService,
    private resultService: ResultService, private errorService: ErrorService) {
      this.user = authService.getUser();
      this.isAdmin = (this.user.role == "admin");
      this.generalHandlers = [{name: "Reload", callback: window.location.reload}, {name: "Go to menus", callback: this.router.navigate.bind(this, ['/menu'])}];
    }

  ngOnInit() {
    this.loadForm();
  }

  loadForm(){
    this.loading = true;
    const menuId = this.activatedRoute.snapshot.params['menuId'];
    this.menuService.getMenu({id: menuId.toString(), limit: "1"})
    .subscribe(
      (menu: MenuData) => {
        this.menu = menu;
        this.isNewForm = (this.menu.form_id == undefined);
        if(!this.isNewForm){
          this.formService.getForm(this.menu.form_id).subscribe(
            (form) => {
              this.form = form;
              this.sections = form.sections;
            },
            (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
          ).add(() => this.loading = false)
        } else this.loading = false;
      },
      (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
    )
  }

  deleteField(sectionIndex: number, fieldIndex: number){
    this.sections[sectionIndex].fields = this.sections[sectionIndex].fields.filter((_ , i) => i !== fieldIndex)
  }

  async newField(index: number){
    const modal = await this.modalController.create({
      component: NewFieldPage
    })
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.sections[index].fields = [...this.sections[index].fields, data];
  }

  async newSection(){
    const alert = await this.alertController.create({
      header: 'Add Section',
      inputs: [
        {
          name: 'section',
          type: 'text',
          placeholder: 'Section name...'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.sections = [...this.sections, {
              name: data.section,
              fields: []
            }]
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteSection(index: number){
    if(this.isAdmin){
      const alert = await this.alertController.create({
        header: `Are you sure to remove ${this.sections[index].name}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Delete',
            handler: () => {
              this.sections = this.sections.filter((_, i) => i !== index);
            }
          }
        ]
      });
      await alert.present();
    }
  }


  trackAnswer(sectionIndex: number, fieldIndex: number, value: string[]|string|boolean){
    const section = this.sections[sectionIndex];
    if(!this.isNewForm){
      const name = `${sectionIndex},${section.name}`;
      if(!this.answers[name]){
        this.answers[name] = section.fields.map(field => ({question: field.question, options: field.options}));
        this.answers[name][fieldIndex].answer = value;
      }else{
        this.answers[name][fieldIndex].answer = value;
      }
    }
  }

  async save(){
    const alert = await this.alertController.create({
      header: 'Save Form',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Form title...'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Form description...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.loading = true;
            this.form.name = data.title;
            this.form.description = data.description;
            this.formService.createForm({
              ...this.form,
              sections: this.sections
            }).subscribe(
              (data: {id: number}) => {
                this.menu.form_id = data.id
                this.menuService.updateMenu(this.menu.id, {form_id: data.id}).subscribe(
                  () => {  this.isNewForm = false },
                  (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
                ).add(() => this.loading = false)
              },
              (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
            );
          }
        }
      ]
    });
    await alert.present();
  }

  async answerAlert(){
    const alert = await this.alertController.create({
      header: 'Answered',
      subHeader: 'Your reply has been sent successfully',
      buttons: [
        {
          text: 'Keep answering',
          handler: () => {
            this.loadForm();
          }
        }, {
          text: 'Go to menus',
          handler: () => {
            this.router.navigate(['/menu']);
          }
        }
      ]
    });

    await alert.present();
  }

  sendAnswers(){
    this.sendingAnswer = true;
    this.resultService.createResult({
      name: `${this.form.name} - ${this.user.username}`,
      result: this.answers as Object as JSON,
      formId: this.menu.form_id
    }).subscribe(
      () => this.answerAlert(),
      (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
    ).add(() => this.sendingAnswer = false)
  }

  logout(){
    this.authService.logout()
  }

}
