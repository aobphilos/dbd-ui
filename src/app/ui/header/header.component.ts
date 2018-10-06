import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NgbModal, NgbModalRef, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout/layout.service';
import { NotifyService } from '../notify/notify.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IndicatorService } from '../indicator/indicator.service';
import { MemberService } from '../../core/member.service';
import { MemberType } from '../../enum/member-type';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NgbDropdownConfig]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef;
  isCollapsed = true;
  isScrollMove = false;
  errorMessage: string;
  signInForm: FormGroup;
  signUpForm: FormGroup;
  forgotPasswordForm: FormGroup;
  toggleMenu: boolean;

  private memberName: string;
  private memberType: MemberType;

  get displayName() {
    return of(this.memberName);
  }

  get shopTypName() {
    let name = '';
    switch (this.memberType) {
      case MemberType.RETAIL: name = 'ข้อมูลร้านค้าปลีก'; break;
      case MemberType.WHOLE_SALE: name = 'ข้อมูลร้านค้าส่ง ค้าปลีก'; break;
      case MemberType.DEALER: name = 'ข้อมูลผู้ผลิต ผู้จำหน่าย'; break;
    }
    return of(name);
  }

  get userVerified() {
    return this.authService.user.pipe(
      map(user => (user && user.emailVerified))
    );
  }

  constructor(
    config: NgbDropdownConfig,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private layoutService: LayoutService,
    private notifyService: NotifyService,
    private indicatorService: IndicatorService,
    private memberService: MemberService
  ) {
    config.placement = 'bottom-right';
    config.autoClose = true;

    this.createForm();
  }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

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
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  tryLogout() {
    this.showBusy();
    this.authService.doLogout()
      .then(
        res => {
          // this.router.navigate(['/home'], );
          window.location.href = '/';
          this.hideBusy();
        },
        err => this.hideBusy());
  }

  tryLogin(value) {
    this.showBusy();
    this.authService.doLogin(value)
      .then(res => {
        this.modalRef.close();
        this.hideBusy();
        if (!res.user.emailVerified) {
          this.notifyService.setWarningMessage('Please verify your email address');
          this.tryLogout();
        } else {
          this.router.navigate(['/member/shop']);
        }
      }, err => {
        this.hideBusy();
        this.notifyService.setWarningMessage(err.message);
      });
  }

  tryRegister(value) {
    this.showBusy();
    this.authService.doRegister(value)
      .then(res => {
        this.modalRef.close();
        this.errorMessage = '';
        this.hideBusy();
        this.notifyService.setSuccessMessage('Your account has been created');
      }, err => {
        this.hideBusy();
        this.notifyService.setWarningMessage(err.message);
      });
  }

  tryResetPassword(value) {
    this.showBusy();
    this.authService.doResetPassword(value.email)
      .then(res => {
        this.modalRef.close();
        this.errorMessage = '';
        this.hideBusy();
        this.notifyService.setSuccessMessage('Check your inbox for the reset password');
      }, err => {
        this.hideBusy();
        this.notifyService.setWarningMessage(err.message);
      });
  }

  setCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  openModal(content) {
    this.signUpForm.reset();
    this.signInForm.reset();
    this.forgotPasswordForm.reset();

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

  onKeyDownForgotPassword(event) {
    if (event.keyCode === 13) {
      this.tryResetPassword(this.forgotPasswordForm.value);
    }
  }

  ngOnInit() {
    this.memberService.currentMember.subscribe(member => {
      if (member) {
        this.memberName = member.storeName;
        this.memberType = member.memberType;
      } else {
        this.memberName = '';
        this.memberType = null;
      }
    });
    this.layoutService.showMainMenu.subscribe(flag => this.toggleMenu = flag);
    this.layoutService.collapseMainMenu.subscribe(flag => this.isCollapsed = flag);
    window.addEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }
}
