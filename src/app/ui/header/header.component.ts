import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef;
  public isCollapsed = true;
  public isScrollMove = false;
  public errorMessage: string;
  public loginForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  private onWindowScroll(e) {
    let scrollY = 0;
    if (e.path && e.path.length > 0) {
      scrollY = e.path[1].scrollY || 0;
    } else if (e.currentTarget && e.currentTarget.window) {
      scrollY = e.currentTarget.window.scrollY || 0;
    }
    this.isScrollMove = (scrollY > 0);
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value)
      .then(res => {
        this.modalRef.close();
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }

  setCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  openModal(content) {
    this.modalRef = this.modalService
      .open(content, {
        windowClass: 'modal-signin',
        backdrop: 'static'
      });

    this.modalRef.result.then(
      value => { },
      reason => {
        if (reason instanceof TemplateRef) {
          this.openModal(reason);
        }
      });
  }

  ngOnInit() {
    window.addEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', (e) => this.onWindowScroll(e), true);
  }
}
