import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { SenderComponent } from 'src/app/modules/call-app/sender/sender.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-message-window',
  templateUrl: './message-window.component.html',
  styleUrls: ['./message-window.component.scss'],
})
export class MessageWindowComponent implements OnInit, AfterViewChecked {
  @Input() selected_user!: any;
  @ViewChild('chatBody') chatBody!: ElementRef;

  users: any[] = [];
  message: string = '';
  typing: boolean = false;
  selectedGroup: any = null;
  preventSrollDown: boolean = false;
  currentPage = 1;

  constructor(
    private userStoreService: UserStoreService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userStoreService.users$.subscribe((users: any[]) => {
      this.users = users;
    });

    this.userStoreService.selectedUser$.subscribe((selectedUser: any) => {
      this.selected_user = selectedUser;
      if (this.selected_user) {
        this.getMessages();
      }
    });

    this.userStoreService.selectedGroup$.subscribe((selectedGroup: any) => {
      this.selectedGroup = selectedGroup;
    });
  }

  ngAfterViewChecked() {
    this.scrollDown();
  }

  scrollDown() {
    if (this.chatBody && !this.preventSrollDown) {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }
  }

  getMessages() {
    this.messageService.getMessages(this.currentPage, this.selected_user.email).subscribe(
      (response: any) => {
        // response.forEach((element: any) => {
        //   element.messages.forEach((msg: any) =>{
        //     this.selected_user.messages.push(msg)
        //   })
        // })
      //  this.userStoreService.users = response;
        // response[0].messages.forEach((element: any) => {
        //   this.selected_user.messages.push(element);
        // });
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  makeCall(audio: any) {
    // const dialogRef = this.dialog.open(SenderComponent, {
    //   data: {
    //     email: this.selected_user.email,
    //     photo: this.selected_user.photo,
    //     name: this.selected_user.first_name,
    //     online: this.selected_user.online,
    //   },
    //   width: '650px',
    //   height: '650px',
    //   disableClose: true,
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   // Handle any result if needed
    // });

    const queryParams = {
      display: JSON.stringify({
        email: this.selected_user.email,
        photo: this.selected_user.photo,
        name: this.selected_user.first_name + this.selected_user.last_name,
        online: this.selected_user.online,
        sender: localStorage.getItem('user'),
      }),
    };

    const urlTree = this.router.createUrlTree(['sender'], { queryParams });

    const url = this.router.serializeUrl(urlTree);
    window.open(
      url,
      '_blank',
      'popup,height=650,width=550,resizable=0,location=no,toolbar=no,menubar=no,resizable=no'
    );
  }

  sendMessage() {
    if (this.message) {
      this.selected_user.messages.push({
        text: this.message,
        read: true,
        date_time: new Date(),
        sender_id: 'me',
      });

      this.messageService.messageSocket.send(
        JSON.stringify({
          sender: localStorage.getItem('user'),
          receiver: this.selected_user.email,
          text: this.message,
        })
      );

      this.message = '';
    }
  }

  dateHumanize(date: Date) {
    return moment(date).fromNow();
  }

  startTyping() {
    this.preventSrollDown = false;
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

  //@HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    this.preventSrollDown = true;
    const element = event.target as HTMLElement;
    const isAtTop = element.scrollTop === 0;

    // Check if the user has scrolled to the bottom

    if (isAtTop) {
      this.handleScroll();
    }
  }

  handleScroll(): void {
    if (this.selected_user) {
      this.currentPage++;
      this.getMessages();
    }
  }
}
