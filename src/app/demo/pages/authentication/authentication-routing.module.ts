import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuardGuard } from 'src/app/commons/guards/login.guard';
import { LoginFirstComponent } from 'src/app/core/login-first/login-first.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./auth-signin/auth-signin.component'),
        canActivate: [LoginGuardGuard]
      },
      {path: 'signin-first', component: LoginFirstComponent,},
      {
        path: 'signup',
        loadComponent: () => import('./auth-signup/auth-signup.component'),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
