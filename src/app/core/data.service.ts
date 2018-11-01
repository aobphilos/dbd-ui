import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Member } from '../model/member';
import { MemberType } from '../enum/member-type';
import { MemberService } from './member.service';
import { auth } from 'firebase';
import { StoreService } from './store.service';
import { Store } from '../model/store';
import { OwnerView } from '../model/views/owner-view';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private retailUrl = 'assets/data/retail.json';
  private wholesaleUrl = 'assets/data/wholesale.json';
  private memberRetails: Observable<Member[]>;
  private memberWholeSales: Observable<Member[]>;

  constructor(
    private http: HttpClient,
    private memberService: MemberService,
    private storeService: StoreService) {
    this.prepareMembers();
  }



  async upload() {
    const password = '123123';

    const addMember = async members => {
      if (members && members.length > 0) {
        members.forEach(async m => {
          // await delay(await this.createUserByEmail(m.email, password), 2000);
          await this.addToDb(m);
        });
      }
    };

    // await this.memberRetails.subscribe(addMember);
    // await this.memberWholeSales.subscribe(addMember);

  }

  private prepareMembers() {

    const getMember = (type: MemberType) => map(response => {
      const members = [];
      if (response) {
        const data = response['data'] as Member[];
        data.forEach(m => {
          m.memberType = type;

          members.push(Object.assign(new Member(), m));
        });
      }
      return members;
    });

    this.memberRetails = this.http.get(this.retailUrl).pipe(getMember(MemberType.RETAIL));
    this.memberWholeSales = this.http.get(this.wholesaleUrl).pipe(getMember(MemberType.WHOLE_SALE));
  }

  private async createUserByEmail(email, password) {
    const result = await auth().createUserAndRetrieveDataWithEmailAndPassword(email, password);
    result.user.emailVerified = true;
    await auth().updateCurrentUser(result.user);
    console.log(`create user-authen : ${email} - complete`);
  }

  private async addToDb(member: Member) {
    const imageUrl = member['imageUrl'];
    delete member['imageUrl'];
    const memberId = await this.memberService.add(member);

    delay(2000);

    const store = new Store();
    store.ownerId = memberId;
    store.owner = OwnerView.create(member);
    store.imageUrl = imageUrl;
    await this.storeService.add(store);

    console.log(`create user-data: ${member.email} - complete`);
  }

}
