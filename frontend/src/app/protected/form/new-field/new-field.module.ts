import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewFieldPageRoutingModule } from './new-field-routing.module';

import { NewFieldPage } from './new-field.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewFieldPageRoutingModule
  ],
  declarations: [NewFieldPage]
})
export class NewFieldPageModule {}
