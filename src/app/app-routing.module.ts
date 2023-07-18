import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./component/login/login.component";
import { HoursregisterComponent } from "./component/hoursregister/hoursregister.component";
import { RegisterComponent } from "./component/register/register.component";
import { HistoryComponent } from "./component/history/history.component";
import { ConsoleComponent } from "./component/console/console.component";
import { InformComponent } from "./component/inform/inform.component";
import { FollowComponent } from "./component/follow/follow.component";
import { InformAdminComponent } from "./component/inform-admin/inform-admin.component";
import { CompanyComponent } from "./component/company/company.component";
import { ChangepasswordComponent } from "./component/changepassword/changepassword.component";
import { NotificationComponent } from "./component/notification/notification.component";
import { RolGuard } from "./guards/rol.guard";
import { ValidateGuard } from "./guards/validate.guard";

const routes: Routes = [
    {
      path:'',
      redirectTo:'/login',
      pathMatch:'full'
    },
    { 
      path: 'schedule', 
      component: HoursregisterComponent,
      canActivate:[ValidateGuard],
     },
    { 
      path: 'register', 
      component: RegisterComponent,
      canActivate:[RolGuard, ValidateGuard]
    },
    { 
      path: 'history', 
      component: HistoryComponent,
      canActivate:[ValidateGuard]
    },
    {
      path:'console',
      component:ConsoleComponent,
      canActivate:[ValidateGuard, RolGuard]
    },
    {
      path:'inform-admin',
      component:InformAdminComponent,
      canActivate:[RolGuard, ValidateGuard]
    },
    {
      path:'inform/activities',
      component:InformComponent,
      canActivate:[RolGuard, ValidateGuard]
    },
    {
      path:'inform/follow',
      component:FollowComponent,
      canActivate:[RolGuard, ValidateGuard]
    },
    {
      path:'company',
      component:CompanyComponent,
      canActivate:[RolGuard, ValidateGuard]
    },
    {
      path:'change-password',
      component:ChangepasswordComponent,
      canActivate:[ValidateGuard]
    },
    {
      path:'notifications',
      component:NotificationComponent,
      canActivate:[ValidateGuard]
    },
    {
      path:'login',
      component:LoginComponent,
    }
  ];  
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }