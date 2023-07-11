import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
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
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import { DateAdapter,MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CompanyComponent } from './component/company/company.component';
import {MatMenuModule} from '@angular/material/menu';
import { ChangepasswordComponent } from './component/changepassword/changepassword.component';
import { InvalidregisterComponent } from './modals/invalidregister/invalidregister.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from './modals/notification/notification.component';
import { SocketinterceptorsService } from './interceptors/socketinterceptors.service';

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
    InformAdminComponent,
    CompanyComponent,
    ChangepasswordComponent,
    InvalidregisterComponent,
    NotificationComponent
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
    AngularMultiSelectModule,
    MatMenuModule,
    NgbModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-GB' },
    {provide: HTTP_INTERCEPTORS, 
    useClass:SocketinterceptorsService,
      multi:true
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
