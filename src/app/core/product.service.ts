import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Product } from '../model/product';
import { Member } from '../model/member';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private collection: AngularFirestoreCollection<Product>;
  currentItems: Observable<Product[]>;
  private ownerId$ = new BehaviorSubject<string>('');

  private get dbPath() {
    return 'Product';
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  constructor(
    private db: AngularFirestore
  ) {
    this.collection = this.db.collection<Product>(this.dbPath, q => q.orderBy('createdDate', 'asc'));
    this.currentItems = this.ownerId$.pipe(
      switchMap(id =>
        this.db.collection<Product>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(items => items.map(
        a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return { id, ...data } as Product;
        }
      ))
    );
  }

  upsert(item: Product) {
    return (item.id) ? this.update(item) : this.add(item);
  }

  add(item: Product) {
    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Product Data'); return; }

      this.collection.add({ ...item })
        .then(result =>
          this.assignOwner(item.ownerId, result.id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));
    });
  }

  update(item: Product) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing Product Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`).ref;
      const original = await itemRef.get();
      if (original.exists) {
        delete item.id;
        itemRef.update({ ...item })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This product is not registered');
      }
    });
  }

  delete(id: string, ownerId: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Product Id'); return; }

      this.db.doc(`${this.dbPath}/${id}`).delete()
        .then(() =>
          this.removeOwner(ownerId, id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));

    });
  }

  getOrCreateItem(id: string) {
    return new Promise<Product>(async (resolve, reject) => {
      id = id || this.db.createId();
      const itemRef = this.collection.doc(id).ref;
      itemRef.get().then(
        result => resolve({ id: result.id, ...result.data() } as Product),
        err => reject(err)
      );
    });
  }

  loadCurrentItems(ownerId: string) {
    this.ownerId$.next(ownerId);
  }

  private assignOwner(ownerId: string, itemId: string) {
    return this.updateOwner(ownerId, itemId, true);
  }

  private removeOwner(ownerId: string, itemId: string) {
    return this.updateOwner(ownerId, itemId, false);
  }

  private updateOwner(ownerId: string, itemId: string, isAssign: boolean) {
    return new Promise<any>(async (resolve, reject) => {
      if (!ownerId) { reject('Missing Owner Id'); return; }
      if (!itemId) { reject('Missing Item Id'); return; }

      // found then update
      const ownerRef = this.db.doc(this.getOwnerPath(ownerId)).ref;
      const original = await ownerRef.get();
      if (original.exists) {
        const owner = original.data() as Member;
        if (isAssign) {
          owner.productIds.push(itemId);
        } else {
          owner.productIds = owner.productIds.filter(id => itemId !== id);
        }
        ownerRef.update({ productIds: owner.productIds })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This owner is not registered');
      }
    });
  }

}
