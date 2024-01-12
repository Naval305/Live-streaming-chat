import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SenderComponent } from './sender/sender.component';
import { ReceiverComponent } from './receiver/receiver.component';


const routes: Routes = [
  { path: 'sender', component: SenderComponent },
  { path: 'receiver', component: ReceiverComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallAppRoutingModule {}
