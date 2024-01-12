import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  user = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_pass: '',
  };

  constructor(
    private registrationService: RegistrationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  register() {
    this.registrationService.register(this.user).subscribe(
      (response) => {
        this.toastr.success(response.message, 'Success');
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
