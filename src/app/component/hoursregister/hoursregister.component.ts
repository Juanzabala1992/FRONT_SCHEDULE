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

@Component({
  selector: 'app-hoursregister',
  templateUrl: './hoursregister.component.html',
  styleUrls: ['./hoursregister.component.css']
})


export class HoursregisterComponent implements OnInit {

  error='';
  id$: any;
  id_user!:string;
  data_user!:any;
  inputArray!: FormArray;
  activate:boolean=false;
  hours:Array<number>=[];
  minutes:Array<number>=[];

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions$!: Observable<string[]>;
  total_horas:string="00:00";
  title = 'form-array';  
  fg!: FormGroup
  dataSourcePacks!: MatTableDataSource<any>;
  displayedColumns = ['activities', 'hours', 'act_initial_date', 'act_final_date', 'eliminar'];
  minDate!: Date;
  maxDate!: Date;

  minDateAct!: Date;
  maxDateAct!: Date;

  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  
  constructor(private dashboardService:DashboardService, private sharedService:SharedService,
    private registerService:RegisterService, private _fb: FormBuilder, private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar, private router: Router, private ngbModal: NgbModal,
    ) { 
      this.hours = Array(100).fill(0).map((x,i)=>i);
      this.minutes = Array(60).fill(0).map((x,i)=>i);
        this.id$=sharedService.getId;
  }

  ngOnInit(): void {

    this.fg = this._fb.group({
      promos: this._fb.array([]),
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
      
      
      let suma_minutos = minutos.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0); 
      if(!minutos){
        suma_minutos=0;
      } 
      const total_horas = suma_minutos/60;
      let module = (total_horas%1)*60;

      let suma_horas = horas.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0);

      const horas_minutos=Math.floor(total_horas);  
      suma_horas= suma_horas+horas_minutos;

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


  deleteLesson(lessonIndex: number): void {

    this.promos.removeAt(lessonIndex);
    this.dataSourcePacks = new MatTableDataSource(this.promos.controls);

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

    Object.keys(this.fg.controls).forEach((controlName) => {
      if (controlName !== 'promos') {
        const control = this.fg.get(controlName);
        if (control?.invalid) {
          controls.push(controlName);          
        }
      }
    });
    let modal = this.ngbModal.open(InvalidregisterComponent,{ size: 'sm'});
    modal.componentInstance.data = controls;
 
    /*const uuid = uuidv4();  
    const work_hours=this.fg.get('promos')?.value;
    const finish = this.fg.get('final_date')?.value;
    const init = this.fg.get('initial_date')?.value;

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
    let data={
      idUser:this.id_user,
      idSch:uuid,
      nombre:this.data_user.nombre,
      numero_de_documento:this.data_user.numero_de_documento,
      actividades:result,      
      fecha_inicio:this.dateFormat(init),
      fecha_fin:this.dateFormat(finish),
      //horas_actividad: `${work_hours.hours}:${work_hours.minutes}`,  
      cliente:this.fg.get('client')?.value,
      total_horas: this.total_horas,
      responsable_cliente:this.fg.get('final_client')?.value,
      observaciones: this.fg.get('observations')?.value
    }
   this.dashboardService.scheduleRegister(data)
    .pipe(first())
    .subscribe({
        next: () => {           
            console.log("Todo ok!")
        },
        error: error => {
            this.error = error;            
        }
    });
    this.openSnackBar(
      'Su registro se guardo exitosamente!',
      'OK'
    );*/
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
      console.log("this.maxDateAct--> ", this.maxDateAct);
      this.minDateAct = selectedDate;
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
