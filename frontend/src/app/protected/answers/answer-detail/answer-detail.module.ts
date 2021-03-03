import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerDetailPageRoutingModule } from './answer-detail-routing.module';

import { AnswerDetailPage } from './answer-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerDetailPageRoutingModule
  ],
  declarations: [AnswerDetailPage]
})
export class AnswerDetailPageModule {}
