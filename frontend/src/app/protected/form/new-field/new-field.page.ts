import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-field',
  templateUrl: './new-field.page.html',
  styleUrls: ['./new-field.page.scss'],
})
export class NewFieldPage implements OnInit {

  constructor(private alertController: AlertController, private modalCtrl: ModalController) { }

  options: string[] = [];

  ngOnInit() {
  }

  async newOption(){
    const alert = await this.alertController.create({
      header: 'Insert name',
      inputs: [
        {
          name: 'option',
          type: 'text',
          placeholder: 'Name...'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data: {option: string}) => {
            this.options = [...this.options, data.option];
          }
        }
      ]
    });
    await alert.present();
  }

  removeOption(index: number){
    this.options = this.options.filter((_, i) => i !== index);
  }

  dismiss(question: string, type: string){
    this.modalCtrl.dismiss({
      question: question,
      type: type,
      options: this.options
    });

  }

}
