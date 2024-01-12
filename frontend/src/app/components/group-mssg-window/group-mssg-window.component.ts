import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { SenderComponent } from 'src/app/modules/call-app/sender/sender.component';

@Component({
  selector: 'app-group-mssg-window',
  templateUrl: './group-mssg-window.component.html',
  styleUrls: ['./group-mssg-window.component.scss'],
})
export class GroupMssgWindowComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef;
  users: any[] = [];
  message: string = '';
  typing: boolean = false;
  selectedGroup: any = null;
  selected_user: any;
  groupChatSocket: any;
  currentUser: any = localStorage.getItem('user');
  groups: any;

  constructor(
    private userStoreService: UserStoreService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.userStoreService.users$.subscribe((users: any[]) => {
    //   this.users = users;
    // });

    // this.userStoreService.selectedUser$.subscribe((selectedUser: any) => {
    //   this.selected_user = selectedUser;
    // });


    this.userStoreService.selectedGroup$.subscribe((selectedGroup: any) => {
      this.selectedGroup = selectedGroup;
      this.groups = this.userStoreService.groups;
      if (this.selectedGroup) {
        this.groupChatSocket = this.messageService.groupChatSocket;

        this.groupChatSocket[this.selectedGroup.id].onmessage = (event: any) => {
          const eventJSON = JSON.parse(event.data);
          const message = JSON.parse(event.data).message;
          const groups = this.groups.find(
            (value: { id: any }) => value.id == message.sender_group
          );

          groups.messages.push(message);
          //this.selectedGroup.messages.push(message);
        };
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollDown();
  }

  getMemberNames(): string {
    return this.selectedGroup.member_names
      .map(
        (member: { first_name: string; last_name: string }) =>
          member.first_name + ' ' + member.last_name
      )
      .join(', ');
  }

  makeCall(audio: any) {
    const dialogRef = this.dialog.open(SenderComponent, {
      data: {
        email: this.selected_user.email,
        photo: this.selected_user.photo,
        name: this.selected_user.first_name,
        online: this.selected_user.online,
      },
      width: '550px',
      height: '650px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any result if needed
    });
  }

  sendMessage() {
    if (this.message) {
      // this.selectedGroup.messages.push({
      //   text: this.message,
      //   date_time: new Date(),
      //   sender__email: localStorage.getItem('user'),
      // });

      this.groupChatSocket[this.selectedGroup.id].send(
        JSON.stringify({
          sender__email: localStorage.getItem('user'),
          date_time: new Date(),
          text: this.message,
          sender_group: this.selectedGroup.id,
        })
      );

      this.message = '';
    }
  }

  dateHumanize(date: Date) {
    return moment(date).fromNow();
  }

  scrollDown() {
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }
  }

  startTyping() {
    if (!this.typing) {
      this.typing = true;
      this.sendTypingStatus(this.typing);
      setTimeout(() => {
        this.stopTyping();
      }, 2000);
    }
  }

  stopTyping() {
    if (this.typing) {
      this.typing = false;
      this.sendTypingStatus(this.typing);
    }
  }

  sendTypingStatus(isTyping: boolean) {
    if (this.message) {
      this.messageService.messageSocket.send(
        JSON.stringify({
          sender: localStorage.getItem('user'),
          typing: isTyping,
          receiver: this.selected_user.email,
        })
      );
    }
  }
}
