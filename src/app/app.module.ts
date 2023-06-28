import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { LoginComponent } from './component/login/login.component';
import { HoursregisterComponent } from './component/hoursregister/hoursregister.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { RegisterComponent } from './component/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { HistoryComponent } from './component/history/history.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TwoDigitPipe  } from './pipes/TwoDigitPipe ';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ConsoleComponent } from './component/console/console.component';
import { InformComponent } from './component/inform/inform.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { FollowComponent } from './component/follow/follow.component';
import { InformAdminComponent } from './component/inform-admin/inform-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HoursregisterComponent,
    NavbarComponent,
    RegisterComponent,
    HistoryComponent,
    TwoDigitPipe,
    ConsoleComponent,
    InformComponent,
    FollowComponent,
    InformAdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule,
    MatInputModule,
    CdkTableModule,
    MatIconModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    FormsModule,
    AngularMultiSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
