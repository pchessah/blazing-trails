import { Injectable, NgZone, inject } from '@angular/core';
import * as auth from 'firebase/auth';

import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {
	Auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  private _alertController: AlertController = inject(AlertController);
  userData: any;
  private afStore: Firestore = inject(Firestore);
  private afAuth: Auth = inject(Auth);
  private loadingCtrl: LoadingController = inject(LoadingController);

  constructor(public router: Router,
              public ngZone: NgZone) { }


  // Login in with email/password
  SignIn(email: any, password: any) {
    this.showLoading()
    return signInWithEmailAndPassword(this.afAuth, email, password).then(()=>{
      this._presentAlert("signed in successfully")
      this.loadingCtrl.dismiss()
    }).catch((e) => {
      this._presentAlert(e)
      this.loadingCtrl.dismiss()
    });
  }
  // Register user with email/password
  RegisterUser(email: any, password: any) {
    this.showLoading()
    return createUserWithEmailAndPassword(this.afAuth, email, password).then(data => {
      this._presentAlert("registered successfully")
      this.SetUserData(data.user)
      this.loadingCtrl.dismiss()
    }).catch((e) => {
      this._presentAlert(e)
      this.loadingCtrl.dismiss()
    });
  }
  // Email verification when new user register
  SendVerificationMail() { }

  // Recover password
  PasswordRecover(passwordResetEmail: any) { }


  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.emailVerified !== false ? true : false;
  }
  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth providers
  AuthLogin(provider: any) { }

  // Store user in localStorage
  SetUserData(user: any) {
    const userRef = doc(this.afStore , `users/`, user.uid);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return setDoc(userRef, userData)

  }
  // Sign-out
  SignOut() {
    this.showLoading()
    return signOut(this.afAuth).then(()=>{
      this._presentAlert("logged out successfully")
      this.router.navigate(['/login'])
      window.location.reload()
      this.loadingCtrl.dismiss()
    }).catch((e) => {
      this._presentAlert(e)
      this.loadingCtrl.dismiss()
    })
  }

  private async _presentAlert(message:string){
    const alert = await this._alertController.create({
      header: 'Recent Updates',
      message: message,
      buttons: ['Dismiss']
    });
    await alert.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });

    loading.present();
  }
}