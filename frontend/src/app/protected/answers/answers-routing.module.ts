import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswersPage } from './answers.page';

const routes: Routes = [
  {
    path: '',
    component: AnswersPage
  },
  {
    path: 'answer-detail',
    loadChildren: () => import('./answer-detail/answer-detail.module').then( m => m.AnswerDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswersPageRoutingModule {}
