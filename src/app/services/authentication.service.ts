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
@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  userData: any;
  private afStore: Firestore = inject(Firestore);
  private afAuth: Auth = inject(Auth);

  constructor(public router: Router,
              public ngZone: NgZone) { }


  // Login in with email/password
  SignIn(email: any, password: any) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }
  // Register user with email/password
  RegisterUser(email: any, password: any) {
    return createUserWithEmailAndPassword(this.afAuth, email, password).then(data => {
      this.SetUserData(data.user)
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
    return signOut(this.afAuth).then(()=>{
      this.router.navigate(['/login'])
    })
  }
}