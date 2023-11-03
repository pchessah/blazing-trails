import { Component, inject } from '@angular/core';
import { RecentUpdatesService } from '../services/recent-updates.service';
import { Observable } from 'rxjs';
import { IRecentUpdate } from '../interfaces/recent-update.interface';
import { InventoryFireStoreService } from '../services/inventory-firestore.service';
import { IItem } from '../interfaces/item.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private _recentUpdateService:RecentUpdatesService = inject(RecentUpdatesService);
  private _inventoryFiresStoreService:InventoryFireStoreService = inject(InventoryFireStoreService);

  recentUpdates$: Observable<IRecentUpdate[]> = this._recentUpdateService.getRecentUpdates();
  lowInventory$: Observable<IItem[]> = this._inventoryFiresStoreService.lowInventory$;
  inventory$: Observable<IItem[]> = this._inventoryFiresStoreService.getinventory()

}
