import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPageRoutingModule } from './form-routing.module';

import { FormPage } from './form.page';
import { InputComponent } from 'src/app/components/fields/input/input.component';
import { CheckComponent } from 'src/app/components/fields/check/check.component';
import { CheckboxComponent } from 'src/app/components/fields/checkbox/checkbox.component';
import { RadioboxComponent } from 'src/app/components/fields/radiobox/radiobox.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormPageRoutingModule
  ],
  declarations: [FormPage, InputComponent, CheckComponent, CheckboxComponent, RadioboxComponent]
})
export class FormPageModule {}
