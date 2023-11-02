import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { IItem } from '../interfaces/item.interface';

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
  itemToEdit!: IItem;

  constructor(private _cd:ChangeDetectorRef){}

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
      this.itemList.push(this.item)
      this.item = {} as any
      this._cd.detectChanges()
    }
  }

  onInput(event: CustomEvent, input: 'qty' | 'item'){
  
    if(input === 'qty'){
      this.item['quantity'] = Number(event.detail.value);
    } else if (input === 'item'){
      this.item['name'] = event.detail.value.toLowerCase();
    }
  }

  
  onEditInput(event: CustomEvent, input: 'qty' | 'item'){
  
    if(input === 'qty'){
      this.itemToEdit['quantity'] = Number(event.detail.value);
    } else if (input === 'item'){
      this.itemToEdit['name'] = event.detail.value.toLowerCase();
    }
  }

  doneEditing(){
    this.itemList.filter(i => i.name !== this.itemToEdit.name).push(this.itemToEdit);
    this.indexToEdit = null as any
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

}
