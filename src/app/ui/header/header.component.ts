import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout/layout.service';
import { NotifyService } from '../notify/notify.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef;
  public isCollapsed = true;
  public isUserCollapsed = true;
  public isScrollMove = false;
  public errorMessage: string;
  public signInForm: FormGroup;
  public signUpForm: FormGroup;
  public toggleMenu: boolean;

  get userEmail() {
    return this.authService.user.email;
  }
  get userVerified() {
    return this.authService.hasVerified;
  }

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private fb: FormBuilder,
    private layoutService: LayoutService,
    private notifyService: NotifyService,
    private router: Router
  ) {
    this.createForm();
  }

  private onWindowScroll(e) {
    let scrollY = 0;
    if (e.path && e.path.length > 0) {
      scrollY = e.path[1].scrollY;
    } else if (e.currentTarget) {
      const win = e.currentTarget.window;
      if (win) {
        scrollY = win.scrollY || win.pageYOffset;
      }
    }
    this.isScrollMove = ((scrollY || 0) > 0);
  }

  createForm() {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryLogout() {
    this.authService.doLogout()
      .then(
        res => {
          this.router.navigate(['/home']);
        },
        err => console.log('Signout failed'));
  }

  tryLogin(value) {
    this.authService.doLogin(value)
      .then(res => {
        this.modalRef.close();
        if (!res.user.emailVerified) {
          this.notifyService.setWarningMessage('Please verify your email address');
          this.tryLogout();
        }
      }, err => {
        this.notifyService.setWarningMessage(err.message);
      });
  }

  tryRegister(value) {
    this.authService.doRegister(value)
      .then(res => {
        this.notifyService.setSuccessMessage('Your account has been created');
        this.modalRef.close();
        this.errorMessage = '';
      }, err => {
        this.notifyService.setWarningMessage(err.message);
      });
  }

  setCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  setUserCollapsed() {
    this.isUserCollapsed = !this.isUserCollapsed;
  }

  openModal(content) {
    this.signUpForm.reset();
    this.signInForm.reset();

    this.modalRef = this.modalService
      .open(content, {
        windowClass: 'modal-signin'
      });

    this.modalRef.result.then(
      value => { },
      reason => {
        if (reason instanceof TemplateRef) {
          this.openModal(reason);
        }
      });
  }

  onKeyDownSignIn(event) {
    if (event.keyCode === 13) {
      this.tryLogin(this.signInForm.value);
    }
  }

  onKeyDownSignUp(event) {
    if (event.keyCode === 13) {
      this.tryRegister(this.signUpForm.value);
    }
  }

  ngOnInit() {
    this.layoutService.showMainMenu.subscribe(flag => this.toggleMenu = flag);
    window.addEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }
}
