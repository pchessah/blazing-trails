import { Injectable, inject } from '@angular/core';
import { Inventory } from '../interfaces/item.interface';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { RecentUpdatesService } from './recent-updates.service';

@Injectable({providedIn: 'root'})

export class InventoryFireStoreService {
 
  private _firestore: Firestore = inject(Firestore);
  private _recentUpdateService:RecentUpdatesService = inject(RecentUpdatesService);
  
  private _lowInventorySrc$$ = new BehaviorSubject<Inventory[]>([]);
  lowInventory$ = this._lowInventorySrc$$.asObservable();

  getinventory(): Observable<Inventory[]> {
    const inventoryCollection = collection(this._firestore, 'inventory');
    return collectionData(inventoryCollection, {idField: 'id'})
    .pipe(
      map(inventory => inventory as Inventory[]),
      tap(inventory => this._getLowInventoryItem(inventory))
    );
  }

  createInventory(inventory: Inventory):Promise<void> {
    const document = doc(collection(this._firestore, 'inventory'), inventory.name);
    return (setDoc(document, inventory)).then((res) => {
      this._recentUpdateService.addRecentUpdate(`${inventory.name} has been added.`)
    });
   }

   updateInventory(inventory: Inventory): Promise<void> {
    const document = doc(this._firestore, 'inventory', inventory?.id);
    const { id, ...data } = inventory;
    return (setDoc(document, data)).then(res => {
      this._recentUpdateService.addRecentUpdate(`${inventory.name} has been updated.`)
    });
  }

  deleteInventory(inventory:Inventory) {
    const document = doc(this._firestore, 'inventory', inventory?.id);
    return (deleteDoc(document)).then(res => {
      this._recentUpdateService.addRecentUpdate(`${inventory.name} has been deleted.`)
    });
  }

  private _getLowInventoryItem(inventoryList:Inventory[]){
    const _lowInventory = inventoryList.filter( i => i.quantity < 10);
    this._lowInventorySrc$$.next( _lowInventory);
  }
  
}