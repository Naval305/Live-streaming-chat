import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  selected_user: any = null;

  constructor(private userStoreService: UserStoreService) {}

  ngOnInit(): void {
    this.userStoreService.users$.subscribe((users) => {
      this.users = users;
    });

    this.userStoreService.selectedUser$.subscribe((selectedUser) => {
      this.selected_user = selectedUser;
    });
  }

  setSelectedUser(user: any) {
    user.messages.forEach((value: { read: boolean }) => (value.read = true));
    this.userStoreService.selectedUser = user;
  }

  getUnreadMessage(user: any) {
    return user.messages.filter((value: { read: any }) => value.read == false).length;
  }
  dateHumanize(datetime: any) {
    return moment(datetime).fromNow();
  }
  summarizeMessage(message: string) {
    if (message.length > 30) {
      return message.substring(0, 30);
    }
    return message;
  }
}
