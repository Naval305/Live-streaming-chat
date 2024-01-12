import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderComponent } from './sender/sender.component';
import { ReceiverComponent } from './receiver/receiver.component';
import { CallAppRoutingModule } from './call-app-routing.module';

@NgModule({
  declarations: [SenderComponent, ReceiverComponent],
  imports: [CommonModule, CallAppRoutingModule,],
})
export class CallAppModule {}
