import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: '',
  };
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login() {
    this.loginService.login(this.user).subscribe(
      (response) => {
        localStorage.setItem('token', response.access);
        localStorage.setItem("user", response.user_details);
        this.toastr.success('Sucess');
        this.router.navigate(['']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
