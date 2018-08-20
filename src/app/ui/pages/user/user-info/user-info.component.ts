import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../register/register.service';
import { RegisterStep } from '../../../../enum/register-step';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../core/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  userInfoForm: FormGroup;
  submitted = false;

  constructor(private router: Router,
    private registerService: RegisterService,
    private authService: AuthService,
    private fb: FormBuilder) { }

  updateInfo() {
    this.registerService.setRegisterStep(RegisterStep.EDIT_DEALER);
  }

  goBack(e: Event) {
    e.preventDefault();
    this.registerService.setRegisterStep(RegisterStep.CHOOSE_PLAN);
  }

  private createForm() {
    this.userInfoForm = this.fb.group({
      storeName: ['', Validators.required],
      ownerName: ['', Validators.required],
      phone: '',
      email: ['', Validators.required],
      facebook: '',
      line: '',
      address: '',
      website: ''
    });
  }

  // convenience getter for easy access to form fields
  get form() { return this.userInfoForm.controls; }

  tryUpdateUser(value) {
    this.submitted = true;

    this.authService.doVerifyEmail(this.registerService.form.code);

    console.log('update: ', JSON.stringify(value));
  }

  ngOnInit() {
    this.createForm();
  }

}
