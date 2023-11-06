import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import { AuthenticationService } from '../services/authentication.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationPageRoutingModule
  ],
  declarations: [RegistrationPage],
  providers: [AuthenticationService]
})
export class RegistrationPageModule {}
