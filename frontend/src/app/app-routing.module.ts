import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatAppComponent } from './components/chat-app/chat-app.component';
import { GroupListComponent } from './shared/group-list/group-list.component';

const routes: Routes = [
  { path: '', component: ChatAppComponent },
  { path: 'group-user-list', component: GroupListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
