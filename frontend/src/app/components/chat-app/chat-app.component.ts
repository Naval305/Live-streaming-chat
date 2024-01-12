import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReceiverComponent } from 'src/app/modules/call-app/receiver/receiver.component';
import { MessageService } from 'src/app/services/message.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.scss'],
})
export class ChatAppComponent implements OnInit {
  users: any[] = [];
  selected_user: any = null;
  connection: any = null;
  messageConnection: any = null;
  selectGroup: boolean = false;

  constructor(
    private userStoreService: UserStoreService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userStoreService.fetchUsers();

    this.userStoreService.users$.subscribe((users: any[]) => {
      this.users = this.userStoreService.users;
      var current_user = this.users.find(
        (user) => user.email == localStorage.getItem('user')
      );
      if (current_user) {
        current_user.online = true;
      }
    });

    this.userStoreService.selectedUser$.subscribe((selectedUser: any) => {
      this.selected_user = selectedUser;
      this.webSocketConnection();
    });
  }

  webSocketConnection(): void {
    var activeEmail = localStorage.getItem('user');
    if (activeEmail) {
      this.connection = this.messageService.notificationSocket;
      this.messageConnection = this.messageService.messageSocket;
      this.connection.onmessage = (event: { data: string }) => {
        const message = JSON.parse(event.data).message;
        if (JSON.parse(event.data).status === 'new_user') {
          this.users.push(message);
        } else {
          this.users.forEach((value) => {
            if (value.email === message.email) value.online = message.online;
          });
        }
      };
      if (this.selected_user) {
        this.messageConnection.onmessage = (event: { data: string }) => {
          const eventJSON = JSON.parse(event.data);
          if (eventJSON.status === 'new_call') {
            this.openCallViewWindow(eventJSON.message);
          } else if (eventJSON.status == 'typing') {
            this.selected_user.isTyping = eventJSON.typing;
          } else {
            const message = JSON.parse(event.data).message;
            this.selected_user.isTyping = false;
            const user = this.users.find(
              (value) => value.email === message.sender
            );
            user.messages.push(message);
            if (this.selected_user.email === user.email) {
              user.messages.forEach(
                (value: { read: boolean }) => (value.read = true)
              );
            }
            const index = this.users.indexOf(user);
            this.users.splice(index, 1);
            this.users.unshift(user);
          }
        };
      }
    }
  }

  openCallViewWindow(data: any): void {
    // const dialogRef = this.dialog.open(ReceiverComponent, {
    //   data: {
    //     email: data["display"].email,
    //     photo: this.selected_user.photo,
    //     name: data["display"].first_name+ data["display"].last_name,
    //     online: data["display"].online,
    //     peer_id: data["data"]["peer_id"]
    //   },
    //   width: '650px',
    //   height: '650px',
    //   disableClose: true,
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {});

    const queryParams = {
      display: JSON.stringify({
        email: data['display'].email,
        photo: this.selected_user.photo,
        name: data['display'].first_name + data['display'].last_name,
        online: data['display'].online,
        peer_id: data['data']['peer_id'],
      }),
    };

    const urlTree = this.router.createUrlTree(['receiver'], { queryParams });

    const url = this.router.serializeUrl(urlTree);
    window.open(
      url,
      '_blank',
      'popup,height=650,width=550,resizable=0,location=no,toolbar=no,menubar=no,resizable=no'
    );
  }

  selectgroup(): void {
    this.selectGroup = true;
    this.userStoreService.selectedUser = null;
    this.userStoreService.selectedGroup = null;
  }

  selectChat(): void {
    this.selectGroup = false;
    this.userStoreService.selectedUser = null;
    this.userStoreService.selectedGroup = null;
  }
}
