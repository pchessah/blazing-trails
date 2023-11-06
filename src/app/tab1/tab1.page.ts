import { Component, inject } from '@angular/core';
import { RecentUpdatesService } from '../services/recent-updates.service';
import { Observable } from 'rxjs';
import { RecentUpdate } from '../interfaces/recent-update.interface';
import { InventoryFireStoreService } from '../services/inventory-firestore.service';
import { Inventory } from '../interfaces/item.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private _recentUpdateService:RecentUpdatesService = inject(RecentUpdatesService);
  private _inventoryFiresStoreService:InventoryFireStoreService = inject(InventoryFireStoreService);

  recentUpdates$: Observable<RecentUpdate[]> = this._recentUpdateService.getRecentUpdates();
  lowInventory$: Observable<Inventory[]> = this._inventoryFiresStoreService.lowInventory$;
  inventory$: Observable<Inventory[]> = this._inventoryFiresStoreService.getinventory()

}
