import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit {
  groupName: any;
  selectedUser: any;
  users: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userData: any,

    private userStoreService: UserStoreService
  ) {}

  ngOnInit(): void {
    this.userStoreService.fetchUsers();

    this.userStoreService.users$.subscribe((users: any[]) => {
      this.users = this.userStoreService.users;
    });
  }

  submitForm() {}
}
