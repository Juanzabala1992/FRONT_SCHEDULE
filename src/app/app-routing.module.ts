import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./component/login/login.component";
import { HoursregisterComponent } from "./component/hoursregister/hoursregister.component";
import { RegisterComponent } from "./component/register/register.component";
import { HistoryComponent } from "./component/history/history.component";
import { ConsoleComponent } from "./component/console/console.component";
import { InformComponent } from "./component/inform/inform.component";
import { FollowComponent } from "./component/follow/follow.component";
import { InformAdminComponent } from "./component/inform-admin/inform-admin.component";

const routes: Routes = [
    { 
        path: '', 
        component: LoginComponent
    },
    { 
      path: 'schedule', 
      component: HoursregisterComponent
    },
    { 
      path: 'register', 
      component: RegisterComponent
    },
    { 
      path: 'history', 
      component: HistoryComponent
    },
    {
      path:'console',
      component:ConsoleComponent
    },
    {
      path:'inform-admin',
      component:InformAdminComponent
    },
    {
      path:'inform/activities',
      component:InformComponent
    },
    {
      path:'inform/follow',
      component:FollowComponent
    },
 
  ];  
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }