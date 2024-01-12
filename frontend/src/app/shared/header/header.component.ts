import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from '../add-group/add-group.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  activeUserName: string = '';
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  logout() {
  }

  addGroup() {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '350px',
      height: '350px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
