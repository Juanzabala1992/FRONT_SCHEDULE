import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, first, map, startWith } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RegisterService } from 'src/app/services/register.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {TwoDigitPipe } from '../../pipes/TwoDigitPipe ';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateFilterFn, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvalidregisterComponent } from 'src/app/modals/invalidregister/invalidregister.component';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-hoursregister',
  templateUrl: './hoursregister.component.html',
  styleUrls: ['./hoursregister.component.css']
})


export class HoursregisterComponent implements OnInit {

  error!:any;
  id$: any;
  id_user!:string;
  data_user!:any;
  inputArray!: FormArray;
  activate:boolean=false;
  hours:Array<number>=[];
  minutes:Array<number>=[];
  extraView:boolean=false;

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions$!: Observable<string[]>;
  total_horas:string="00:00";
  title = 'form-array';  
  fg!: FormGroup
  dataSourcePacks!: MatTableDataSource<any>;
  dataSourcePacks2!: MatTableDataSource<any>;
  displayedColumns = ['activities', 'hours', 'act_initial_date', 'act_final_date', 'eliminar'];
  minDate!: Date;
  maxDate!: Date;
  clients:[]=[];
  final_client:[]=[];
  minDateAct!: Date;
  maxDateAct!: Date;

  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  
  constructor(private dashboardService:DashboardService, private sharedService:SharedService,
    private registerService:RegisterService, private _fb: FormBuilder, private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar, private router: Router, private ngbModal: NgbModal,
    private followService:FollowService
    ) { 
      this.hours = Array(100).fill(0).map((x,i)=>i);
      this.minutes = Array(60).fill(0).map((x,i)=>i);
        this.id$=sharedService.getId;
  }

  ngOnInit(): void {

    this.fg = this._fb.group({
      promos: this._fb.array([]),
      extras:this._fb.array([]),
      initial_date: new FormControl('', [Validators.required]),
      final_date: new FormControl('', [Validators.required]),
      observations: new FormControl(''),
      client:new FormControl('', [Validators.required]),
      final_client:new FormControl('', [Validators.required]),
      total_horas:new FormControl('')
    });

    this.id$.subscribe((id:string)=>{
      this.id_user=id;
    });

    this.addLesson();
    this.loadData();
    
    this.fg.valueChanges.subscribe(data=>{    
      
      const horas = data.promos.map((info:any)=>{
        return Number(info.hours);
      });
      const minutos = data.promos.map((info:any)=>{
        return Number(info.minutes);
      });
      
      const horasExt = data.extras.map((info:any)=>{
        return Number(info.hoursExt);
      });
      const minutosExt = data.extras.map((info:any)=>{
        return Number(info.minutesExt);
      });
      
      let suma_minutos = minutos.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0);
      let suma_extras = minutosExt.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0); 
      if(!minutos){
        suma_minutos=0;
      } 
      const total_horas = (suma_minutos+suma_extras)/60;
      let module = (total_horas%1)*60;

      let suma_horas = horas.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0);
      let suma_horas_extras = horasExt.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0);

      const horas_minutos=Math.floor(total_horas);  
      suma_horas= suma_horas+horas_minutos+suma_horas_extras;

      if(suma_horas<10){
        suma_horas = 0+String(suma_horas);        
      }
      if(module<10){
        this.total_horas=`${suma_horas}:0${module}`; 
      }else{
        this.total_horas=`${suma_horas}:${module}`;
      }
           
    })

    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.followService.getClientAll()
    .pipe(first())
    .subscribe({
        next: (data) => {             
            this.takeClients(data);
        },
        error: error => {
            this.error = error;            
        }
    });
  }

  takeClients(data:any){
    this.clients=data.map((client:any)=>{
      return client.client;
    });
    this.final_client=data.map((client:any)=>{
      return client.client_final;    
    });
  }
  loadData(){
    this.registerService.getUser(this.id_user)
    .pipe(first())
    .subscribe({
        next: (data) => {             
            this.data_user=data;
        },
        error: error => {
            this.error = error;            
        }
    });
  }

  get promos() {
    return this.fg.controls["promos"] as FormArray;
  };

  get extras() {
    return this.fg.controls["extras"] as FormArray;
  };

  addLesson(): void {

    const lessonForm = this._fb.group({
      activities: new FormControl('', [Validators.required]),
      hours: new FormControl('', [Validators.required]),
      minutes: new FormControl('', [Validators.required]),
      act_final_date: new FormControl('', [Validators.required]),
      act_initial_date: new FormControl('', [Validators.required])    
    });

    
    this.promos.push(lessonForm);
    this.dataSourcePacks = new MatTableDataSource(this.promos.controls);

    this.cd.detectChanges();

  };

  addLessonExtra(): void {
    this.extraView=true;
    const lessonForm = this._fb.group({
      activitiesExt: new FormControl('', [Validators.required]),
      hoursExt: new FormControl('', [Validators.required]),
      minutesExt: new FormControl('', [Validators.required]),
      act_final_dateExt: new FormControl('', [Validators.required]),
      act_initial_dateExt: new FormControl('', [Validators.required])    
    });

    
    this.extras.push(lessonForm);
    this.dataSourcePacks2 = new MatTableDataSource(this.extras.controls);

    this.cd.detectChanges();

  };

  deleteLesson(lessonIndex: number): void {

    this.promos.removeAt(lessonIndex);
    this.dataSourcePacks = new MatTableDataSource(this.promos.controls);

  };

  deleteExtras(lessonIndex: number): void {

    this.extras.removeAt(lessonIndex);
    this.dataSourcePacks2 = new MatTableDataSource(this.extras.controls);

  };

  dateFormat(fechaString:string){
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; 
    const anio = fecha.getFullYear();
    const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio.toString()}`;
    return fechaFormateada;    
  }

  save(){ 
    const controls:Array<string>=[];
    const promosArray = this.fg.get('promos') as FormArray;
    promosArray.controls.forEach((promoForm) => {
      if (promoForm instanceof FormGroup) {
        Object.keys(promoForm.controls).forEach((controlName) => {
          const control = promoForm.get(controlName);
          if (control?.invalid) {
            controls.push(controlName);            
          }
        });
      }
    });

    const extraArray = this.fg.get('extras') as FormArray;
    extraArray.controls.forEach((promoForm) => {
      if (promoForm instanceof FormGroup) {
        Object.keys(promoForm.controls).forEach((controlName) => {
          const control = promoForm.get(controlName);
          if (control?.invalid) {
            controls.push(controlName);            
          }
        });
      }
    });
    const prom = this.fg.get('promos')?.value; 
     
    if( prom.length==0){
      this.openSnackBar(
        'Agrege por lo menos una actividad!',
        'OK'
      );
    }else{
      if(controls.length !=0){
        let modal = this.ngbModal.open(InvalidregisterComponent,{ size: 'sm'});
        modal.componentInstance.data = controls;
      }else{
        const uuid = uuidv4();  
        const work_hours=this.fg.get('promos')?.value;
        const finish = this.fg.get('final_date')?.value;
        const init = this.fg.get('initial_date')?.value;

        const work_hours_ext=this.fg.get('extras')?.value;
    
        let  result = work_hours.map((data:any)=>{
              let result_hours=Number(data.hours);
              let result_minutes=Number(data.minutes);
              if(result_hours<10){
                `0${data.hours}`
              }
              if(result_minutes<10){
                `0${data.minutes}`
              }
          return {
            hours:`${data.hours}:${data.minutes}`,
            initial_date:data.act_initial_date,
            final_date:data.act_final_date,
            data:data.activities
        };
      })

      let  result_ext = work_hours.map((data:any)=>{
        let result_hours=Number(data.hours);
        let result_minutes=Number(data.minutes);
        if(result_hours<10){
          `0${data.hours}`
        }
        if(result_minutes<10){
          `0${data.minutes}`
        }
    return {
      hours:`${data.hours}:${data.minutes}`,
      initial_date:data.act_initial_date,
      final_date:data.act_final_date,
      data:data.activities
    };
  })

      let data={
        idUser:this.id_user,
        idSch:uuid,
        nombre:this.data_user.nombre,
        numero_de_documento:this.data_user.numero_de_documento,
        actividades:result,
        actividades_extras: result_ext,      
        fecha_inicio:this.dateFormat(init),
        fecha_fin:this.dateFormat(finish),         
        cliente:this.fg.get('client')?.value,
        total_horas: this.total_horas,
        responsable_cliente:this.fg.get('final_client')?.value,
        observaciones: this.fg.get('observations')?.value
      }
     this.dashboardService.scheduleRegister(data)
      .pipe(first())
      .subscribe({
          next: () => {           
            this.openSnackBar(
              'Su registro se guardo exitosamente!',
              'OK'
            );
          },
          error: error => {
              this.error = error; 
              this.openSnackBar(
                this.error.error.message,
                'OK'
              );          
          }
      });
     }    
    }    
  }

  history(){
    this.router.navigate(['/history']);
  }

  onStartDateSelected(event: any): void {
    const selectedDate = event.value;
    if (selectedDate) {      
      const fridayDate = moment(selectedDate-15).endOf('isoWeek').day(5).toDate();      
      this.fg.get('final_date')?.setValue(fridayDate);
      this.maxDateAct = moment(selectedDate-14).endOf('isoWeek').day(5).toDate();      
      this.minDateAct = selectedDate;
    }
  }

  onStartDateSelectedFinal(event: any){
    const selectedDate = event.value; 
    const finish= moment(selectedDate).endOf('isoWeek').day(5).toDate() 
    const init = this.fg.get('initial_date')?.value;
    
    if(init<finish){
      this.fg.get('final_date')?.setValue(init);
      this.openSnackBar(
        'Fecha final no puede ser menor que la fecha inicial',
        'OK'
      );
    }
  }
 
  weekendsDatesFilter:DateFilterFn<Date | null> = (date:any): boolean => {
    return this.sharedService.weekendsDatesFilter(date);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar']
    });
  }
}
