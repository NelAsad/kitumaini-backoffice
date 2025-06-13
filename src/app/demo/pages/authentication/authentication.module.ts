import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, 
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule]
})
export class AuthenticationModule {}
