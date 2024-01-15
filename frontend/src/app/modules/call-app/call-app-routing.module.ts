import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SenderComponent } from './sender/sender.component';
import { ReceiverComponent } from './receiver/receiver.component';
import { SenderGroupComponent } from './sender-group/sender-group.component';
import { ReceiverGroupComponent } from './receiver-group/receiver-group.component';

const routes: Routes = [
  { path: 'sender', component: SenderComponent },
  { path: 'receiver', component: ReceiverComponent },
  { path: 'sender-group', component: SenderGroupComponent },
  { path: 'receiver-group', component: ReceiverGroupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallAppRoutingModule {}
