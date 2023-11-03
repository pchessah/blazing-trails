import { Injectable, inject } from '@angular/core';
import { IItem } from '../interfaces/item.interface';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { RecentUpdatesService } from './recent-updates.service';

@Injectable({providedIn: 'root'})

export class InventoryFireStoreService {
 
  private _firestore: Firestore = inject(Firestore);
  private _recentUpdateService:RecentUpdatesService = inject(RecentUpdatesService);
  
  private _lowInventorySrc$$ = new BehaviorSubject<IItem[]>([]);
  lowInventory$ = this._lowInventorySrc$$.asObservable();

  getinventory(): Observable<IItem[]> {
    const inventoryCollection = collection(this._firestore, 'inventory');
    return collectionData(inventoryCollection, {idField: 'id'})
    .pipe(
      map(inventory => inventory as IItem[]),
      tap(inventory => this._getLowInventoryItem(inventory))
    );
  }

  createInventory(inventory: IItem):Promise<void> {
    const document = doc(collection(this._firestore, 'inventory'), inventory.name);
    return (setDoc(document, inventory)).then((res) => {
      this._recentUpdateService.addRecentUpdate(`${inventory.name} has been added`)
    });
   }

   updateInventory(inventory: IItem): Promise<void> {
    const document = doc(this._firestore, 'inventory', inventory?.id);
    const { id, ...data } = inventory;
    return (setDoc(document, data)).then(res => {
      this._recentUpdateService.addRecentUpdate(`${inventory.name} has been updated`)
    });
  }

  private _getLowInventoryItem(inventoryList:IItem[]){
    const _lowInventory = inventoryList.filter( i => i.quantity < 10);
    this._lowInventorySrc$$.next( _lowInventory);
  }
  
}