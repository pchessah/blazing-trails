import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { RecentUpdate } from '../interfaces/recent-update.interface';
import { Observable, map } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({providedIn: 'root'})

export class RecentUpdatesService {

  private _firestore: Firestore = inject(Firestore);
  private _alertController: AlertController = inject(AlertController);

  addRecentUpdate(message:string):Promise<void> {
    const _date = new Date().getTime()
    const document = doc(collection(this._firestore, 'recent-updates'), String(_date));
    const _recentUpdate = {
      message: message,
      id: String(_date)
    }
    this._presentAlert(message)
    return (setDoc(document, _recentUpdate));
   }

   getRecentUpdates(): Observable<RecentUpdate[]> {
    const recentUpdateCollection = collection(this._firestore, 'recent-updates');
    return collectionData(recentUpdateCollection, {idField: 'id'})
    .pipe(
      map(recentUpdates => recentUpdates as RecentUpdate[]),
      map(recentUpdates => recentUpdates.sort((a,b) => Number(b.id) - Number(a.id)).slice(0, 3)),
    );
  }

  private async _presentAlert(message:string){
    const alert = await this._alertController.create({
      header: 'Recent Updates',
      message: message,
      buttons: ['Dismiss']
    });
    await alert.present();
  }

  
}