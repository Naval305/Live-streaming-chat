import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from '../add-group/add-group.component';
import { UserStoreService } from 'src/app/services/user-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  activeUserName: string = '';
  constructor(
    private dialog: MatDialog,
    private userService: UserStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  addGroup() {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '350px',
      height: '350px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.userService.getGroups();
    });
  }
}
