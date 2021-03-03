import {  Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorPage, ErrorHandler } from '../components/modals/error/error.page';



@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  modal: HTMLIonModalElement = undefined;

  constructor(private modalController: ModalController) { }


  public async displayError(error: string, handlers: ErrorHandler[]){
    this.modal =  await this.modalController.create({
      component: ErrorPage,
      componentProps: {
        'error': error,
        'handlers': handlers
      }
    })
    return await this.modal.present();
  }

  public async hideError(){
    if(this.modal){
      await this.modal.dismiss();
      this.modal = undefined;
    }
  }
}
