import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {MenuData, MenuService} from '../../services/menu.service'
import {FormData, SectionData, FieldData, FormService} from '../../services/form.service';
import { UserService, UserData } from 'src/app/services/user.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NewFieldPage } from './new-field/new-field.page';
import { ResultService } from 'src/app/services/result.service';


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
  isNewForm: boolean = true;
  sendingAnswer: boolean = false;

  answers: SectionAnswer = {};

  constructor(private menuService: MenuService, private activatedRoute: ActivatedRoute,
    private userService: UserService, private modalController: ModalController,
    private alertController: AlertController, private formService: FormService,
    private resultService: ResultService) { }

  ngOnInit() {
    this.userService.getData()
    .subscribe(
      (user: UserData) => {
        this.user = user;
        this.isAdmin = (this.user.role == "admin")
      }
    );
    this.loadForm();
  }

  loadForm(){
    const menuId = this.activatedRoute.snapshot.params['menuId'];
    this.menuService.getMenu({id: menuId.toString(), limit: "1"}).subscribe(
      (menu: MenuData) => {
        this.menu = menu;
        this.isNewForm = (this.menu.formId == undefined);
        if(!this.isNewForm){
          this.formService.getForm(this.menu.formId).subscribe(
            (form) => {
              this.form = form;
              this.sections = form.sections;
            }
          )
        }
      }
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
            this.form.name = data.title;
            this.form.description = data.description;
            this.formService.createForm({
              ...this.form,
              sections: this.sections
            }).subscribe(
              (data: {id: number}) => {
                this.menu.formId = data.id
                this.menuService.updateMenu(this.menu.id, {formId: data.id}).subscribe(
                  () => {  this.isNewForm = false }
                )
              }
            );
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
      formId: this.menu.formId
    }).subscribe(
      () => {
        this.loadForm();
        this.sendingAnswer = false;
      }
    )
  }

}
