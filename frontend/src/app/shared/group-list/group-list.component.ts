import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'group-user-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  groups: any = [];
  selected_user: any = null;

  constructor(
    private userStoreService: UserStoreService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userStoreService.getGroups().subscribe((response) => {
      this.groups = response;
      this.userStoreService.groups = this.groups;
      this.groups.map((obj: any) => {
          this.messageService.connectGroupChatSocket(obj.id);
      });
    });
    // this.userStoreService.users$.subscribe((users) => {
    //   this.users = users;
    // });
    // this.userStoreService.selectedUser$.subscribe((selectedUser) => {
    //   this.selected_user = selectedUser;
    // });
  }

  setSelectedGroup(group: any) {
    // user.messages.forEach((value: { read: boolean; }) => (value.read = true));
    this.userStoreService.selectedGroup = group;
  }

  getUnreadMessage(user: any) {}
  dateHumanize(datetime: any) {}
  summarizeMessage(message: string) {}
}
