import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordResetPageRoutingModule } from './password-reset-routing.module';

import { PasswordResetPage } from './password-reset.page';
import { AuthenticationService } from '../services/authentication.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordResetPageRoutingModule
  ],
  declarations: [PasswordResetPage],
  providers: [AuthenticationService]
})
export class PasswordResetPageModule {}
