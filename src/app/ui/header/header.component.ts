import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout/layout.service';
import { NotifyService } from '../notify/notify.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { IndicatorService } from '../indicator/indicator.service';
import { MemberService } from '../../core/member.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef;
  isCollapsed = true;
  isUserCollapsed = true;
  isScrollMove = false;
  errorMessage: string;
  signInForm: FormGroup;
  signUpForm: FormGroup;
  toggleMenu: boolean;

  private memberName: string;
  private hasVerified: boolean;

  get displayName() {
    return of(this.memberName);
  }

  get userVerified() {
    return of(this.hasVerified);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private layoutService: LayoutService,
    private notifyService: NotifyService,
    private indicatorService: IndicatorService,
    private memberService: MemberService
  ) {
    this.createForm();
    this.authService.user.subscribe(user => {
      if (user) {
        this.hasVerified = user.emailVerified;
      } else {
        this.hasVerified = false;
      }
    });
    this.memberService.currentMember.subscribe(member => {
      if (member) {
        this.memberName = member.storeName;
      } else {
        this.memberName = '';
      }
    });
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
  }

  tryLogout() {
    this.showBusy();
    this.authService.doLogout()
      .then(
        res => {
          this.router.navigate(['/home']);
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

  setCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  setUserCollapsed(event: Event) {
    event.preventDefault();
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
    this.router.events
      .pipe(
        filter((event, index) => event instanceof NavigationEnd)
      )
      .subscribe(event => this.isUserCollapsed = true);

    this.layoutService.showMainMenu.subscribe(flag => this.toggleMenu = flag);
    window.addEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }
}
