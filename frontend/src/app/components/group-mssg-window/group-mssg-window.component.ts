import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'src/app/services/message.service';
import { UserStoreService } from 'src/app/services/user-store.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userStoreService.selectedGroup$.subscribe((selectedGroup: any) => {
      this.selectedGroup = selectedGroup;
      this.groups = this.userStoreService.groups;
      if (this.selectedGroup) {
        this.groupChatSocket = this.messageService.groupChatSocket;

        this.groupChatSocket[this.selectedGroup.id].onmessage = (
          event: any
        ) => {
          const eventJSON = JSON.parse(event.data);
          if (eventJSON.status === 'new_call') {
            if (
              eventJSON.message['data'].sender != localStorage.getItem('user')
            ) {
              this.openCallViewWindow(eventJSON.message);
            }
          } else {
            const message = eventJSON.message;
            const groups = this.groups.find(
              (value: { id: any }) => value.id == message.sender_group
            );

            groups.messages.push(message);
          }
        };
      }
    });
  }

  openCallViewWindow(data: any): void {
    const queryParams = {
      display: JSON.stringify({
        id: data['data'].group_id,
        name: data['data'].sender_name,
        sender: data['data'].sender,
        photo: 'assets/images/logo.png',
        peer_id: data['data']['peer_id'],
      }),
    };

    const urlTree = this.router.createUrlTree(['receiver-group'], {
      queryParams,
    });

    const url = this.router.serializeUrl(urlTree);
    window.open(
      url,
      '_blank',
      'popup,height=650,width=550,resizable=0,location=no,toolbar=no,menubar=no,resizable=no'
    );
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
    const queryParams = {
      display: JSON.stringify({
        id: this.selectedGroup.id,
        name: this.selectedGroup.name,
        sender: this.currentUser,
        photo: 'assets/images/logo.png',
        sockets: Object.keys(this.groupChatSocket),
      }),
    };

    const urlTree = this.router.createUrlTree(['sender-group'], {
      queryParams,
    });

    const url = this.router.serializeUrl(urlTree);
    window.open(
      url,
      '_blank',
      'popup,height=650,width=550,resizable=0,location=no,toolbar=no,menubar=no,resizable=no'
    );
  }

  sendMessage() {
    if (this.message) {
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
