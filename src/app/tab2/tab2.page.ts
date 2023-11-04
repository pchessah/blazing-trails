import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { IItem } from '../interfaces/item.interface';
import { InventoryFireStoreService } from '../services/inventory-firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tab2Page {

  @ViewChild(IonModal) modal!: IonModal;

  item: IItem = {} as any;
  itemList: IItem[] = [];
  indexToEdit!: number
  itemToEdit: IItem =  {} as any;

  private _inventoryFireStoreService:InventoryFireStoreService = inject(InventoryFireStoreService);
  private _cd:ChangeDetectorRef = inject(ChangeDetectorRef);

  inventoryList$:Observable<IItem[]> = this._inventoryFireStoreService.getinventory()

  cancel() {
    this.item = undefined as any;
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.item, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<IItem>>;
    if (ev.detail.role === 'confirm' && !!this.item) {
      this._inventoryFireStoreService.createInventory(this.item).then(res => {
        this.item = {} as any
        this._cd.detectChanges()
      })
    }
  }

  onInput(event: CustomEvent, input: 'qty' | 'item'){
  
    if(input === 'qty'){
      this.item.quantity = Number(event.detail.value);
    } else if (input === 'item'){
      this.item.name = event.detail.value.toLowerCase();
      this.item.id = event.detail.value.toLowerCase();
    }
  }

  
  onEditInput(event: CustomEvent, input: 'qty' | 'item'){
  
    if(input === 'qty'){
      this.itemToEdit.quantity = Number(event.detail.value);
    } else if (input === 'item'){
      this.itemToEdit.name = event.detail.value.toLowerCase();
    }
  }

  doneEditing(){
    this._inventoryFireStoreService.updateInventory(this.itemToEdit).then(() => {
      this.indexToEdit = null as any;
      this.itemToEdit = {} as any;
    })
  }

  changeQuantitityOfItemToEdit(addOrSubtract: "+" | "-"){
    if(addOrSubtract === '+'){
       this.itemToEdit.quantity++;
    }else if(addOrSubtract === '-' && this.itemToEdit['quantity'] > 0){
       this.itemToEdit.quantity--;
    }
  }

  trackBy(index: number, item: IItem):string {
    return item.name;
  }

  setEditMode(item: IItem, index:number) {
    this.indexToEdit = index;
    this.itemToEdit = item;
  }

  deleteInventory(item:IItem){
    this._inventoryFireStoreService.deleteInventory(item).then(() => {
      this.itemList = this.itemList.filter(i => i.id!== item.id);
    })
  }

}
