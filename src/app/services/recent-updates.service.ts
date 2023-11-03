import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { IRecentUpdate } from '../interfaces/recent-update.interface';
import { Observable, map } from 'rxjs';

@Injectable({providedIn: 'root'})

export class RecentUpdatesService {

  private _firestore: Firestore = inject(Firestore);

  addRecentUpdate(message:string):Promise<void> {
    const _date = new Date().getTime()
    const document = doc(collection(this._firestore, 'recent-updates'), String(_date));
    const _recentUpdate = {
      message: message,
      id: String(_date)
    }
    return (setDoc(document, _recentUpdate));
   }

   getRecentUpdates(): Observable<IRecentUpdate[]> {
    const recentUpdateCollection = collection(this._firestore, 'recent-updates');
    return collectionData(recentUpdateCollection, {idField: 'id'})
    .pipe(
      map(recentUpdates => recentUpdates as IRecentUpdate[]),
      map(recentUpdates => recentUpdates.sort((a,b) => Number(b.id) - Number(a.id)).slice(0, 3)),
    );
  }

  
}