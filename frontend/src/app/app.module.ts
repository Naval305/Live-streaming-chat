import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ChatAppComponent } from './components/chat-app/chat-app.component';
import { UserListComponent } from './shared/user-list/user-list.component';
import { HeaderComponent } from './shared/header/header.component';
import { SearchComponent } from './shared/search/search.component';
import { MessageWindowComponent } from './components/message-window/message-window.component';
import { AuthModule } from './modules/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CallAppModule } from './modules/call-app/call-app.module';
import { GroupListComponent } from './shared/group-list/group-list.component';
import { GroupMssgWindowComponent } from './components/group-mssg-window/group-mssg-window.component';
import { MatIconModule } from '@angular/material/icon';
import { AddGroupComponent } from './shared/add-group/add-group.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    ChatAppComponent,
    UserListComponent,
    HeaderComponent,
    SearchComponent,
    MessageWindowComponent,
    GroupListComponent,
    GroupMssgWindowComponent,
    AddGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({}),
    BrowserAnimationsModule,
    MatDialogModule,
    AuthModule,
    CallAppModule,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
