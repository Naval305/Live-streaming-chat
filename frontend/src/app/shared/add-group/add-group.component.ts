import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
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
    private dialogRef: MatDialogRef<AddGroupComponent>,
    private userStoreService: UserStoreService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userStoreService.fetchUsers();

    this.userStoreService.users$.subscribe((users: any[]) => {
      this.users = this.userStoreService.users;
    });
  }

  submitForm() {
    var users = this.selectedUser.map((email: any) => ({ email }));
    this.messageService
      .addGroup(users, this.groupName)
      .subscribe((response) => {
        this.dialogRef.close();
      });
  }
}
