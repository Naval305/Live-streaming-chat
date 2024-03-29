import { Component, OnInit } from '@angular/core';
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
    this.userStoreService.getGroups();
    this.userStoreService.groups$.subscribe((response: any) => {
      if (response && response.length != 0) {
        this.groups = response['results'];
        this.groups.map((obj: any) => {
          this.messageService.connectGroupChatSocket(obj.id);
        });
      }
    });
  }

  setSelectedGroup(group: any) {
    this.userStoreService.selectedGroup = group;
  }

  getUnreadMessage(user: any) {}
  dateHumanize(datetime: any) {}
  summarizeMessage(message: string) {}
}
