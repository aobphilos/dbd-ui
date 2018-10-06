import { Component, OnInit, Input } from '@angular/core';
import { RegisterService } from '../../register/register.service';
import { RegisterStep } from '../../../../enum/register-step';
import { AuthService } from '../../../../core/auth.service';
import { MemberService } from '../../../../core/member.service';
import { Member } from '../../../../model/member';
import { MemberType } from '../../../../enum/member-type';
import { IndicatorService } from '../../../indicator/indicator.service';
import { ILocationSelected } from '../../../../model/interfaces/location-selected';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss']
})
export class MemberInfoComponent implements OnInit {

  @Input() mode: string;
  model: Member;
  submitted = false;
  locationSelected: ILocationSelected;

  constructor(private registerService: RegisterService,
    private authService: AuthService,
    private memberService: MemberService,
    private indicatorService: IndicatorService) { }

  // convenience getter for easy access to form fields
  get registerForm() { return this.registerService.form; }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

  get isRegister() {
    return this.mode === 'register';
  }

  get isEdit() {
    return this.mode === 'edit';
  }

  goNext() {
    switch (this.registerForm.planId) {
      case MemberType.RETAIL:
        this.registerService.setRegisterStep(RegisterStep.EDIT_RETAIL);
        break;
      case MemberType.WHOLE_SALE:
        this.registerService.setRegisterStep(RegisterStep.EDIT_WHOLE_SALE);
        break;
      case MemberType.DEALER:
        this.registerService.setRegisterStep(RegisterStep.EDIT_DEALER);
        break;
    }
  }

  goBack(e: Event) {
    e.preventDefault();
    this.registerService.setRegisterStep(RegisterStep.CHOOSE_PLAN);
  }

  private buildModel() {
    this.model = new Member();
    this.model.email = this.registerForm.username;
    this.model.memberType = this.registerForm.planId;
    this.locationSelected = {
      provinceSelected: null,
      districtSelected: null,
      subDistrictSelected: null,
      postalCodeSelected: null
    };
  }

  private loadModel() {
    this.memberService.currentMember.subscribe(member => {
      if (member) {
        this.model = member;
        this.getLocationFromModel();
      }
    });
  }

  private getLocationFromModel() {
    this.locationSelected = {
      provinceSelected: this.model.province,
      districtSelected: this.model.district,
      subDistrictSelected: this.model.subDistrict,
      postalCodeSelected: this.model.postalCode
    };
  }

  private setLocationToModel() {
    this.model.province = this.locationSelected.provinceSelected;
    this.model.district = this.locationSelected.districtSelected;
    this.model.subDistrict = this.locationSelected.subDistrictSelected;
    this.model.postalCode = this.locationSelected.postalCodeSelected;
  }

  async tryUpdateMember() {
    this.showBusy();
    this.submitted = true;
    this.setLocationToModel();
    if (this.isRegister) {
      await this.addMember();
    } else {
      await this.updateMember();
    }
    this.goNext();
    this.hideBusy();
  }

  async addMember() {
    const memberId = await this.memberService.add(this.model);
    this.registerService.setMemberId(memberId);
    await this.authService.doVerifyEmail(this.registerForm.code);
  }

  async updateMember() {
    await this.memberService.update(this.model);
  }

  ngOnInit() {
    if (this.isRegister) {
      this.buildModel();
    } else {
      this.loadModel();
    }
  }

}
