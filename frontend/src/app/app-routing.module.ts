import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatAppComponent } from './components/chat-app/chat-app.component';
import { GroupListComponent } from './shared/group-list/group-list.component';
import { AuthGuard } from './modules/auth/auth.guard';

const routes: Routes = [
  { path: '', component: ChatAppComponent, canActivate: [AuthGuard]},
  { path: 'group-user-list', component: GroupListComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
