import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderComponent } from './sender/sender.component';
import { ReceiverComponent } from './receiver/receiver.component';
import { CallAppRoutingModule } from './call-app-routing.module';
import { SenderGroupComponent } from './sender-group/sender-group.component';
import { ReceiverGroupComponent } from './receiver-group/receiver-group.component';

@NgModule({
  declarations: [
    SenderComponent,
    ReceiverComponent,
    SenderGroupComponent,
    ReceiverGroupComponent,
  ],
  imports: [CommonModule, CallAppRoutingModule],
})
export class CallAppModule {}
