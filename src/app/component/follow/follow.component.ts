import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FollowService } from 'src/app/services/follow.service';
import { RegisterService } from 'src/app/services/register.service';
import { count, first } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { FollowModel } from '../../model/followModel';
import { FollowInsideModel } from '../../model/followInisideModel';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  data: any;
  displayedColumns: string[] = ['recurso', 'cliente', 'clientefinal', 'contactocliente', 'contactoclientefinal', 'fechacontrato', 'seguimiento', 'puntodeatencion', 'responsable'];
  error: any;
  dataSourcesActivities = new MatTableDataSource<any>();
  dropdownList: any = [];
  selectedItems: any = [];
  registers!: any;
  dropdownSettings: any = {};
  tableForm!: FormGroup;
  notification_message!:any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private followService: FollowService, 
    private fb: FormBuilder, private _snackBar: MatSnackBar, private sharedService:SharedService) {
    this.dropdownList = [
      { "id": 1, "itemName": "Incidencia", "image": "../../../assets/icons/alert-icon.png" },
      { "id": 2, "itemName": "Resuelto", "image": "../../../assets/icons/green_alert.png" },
      { "id": 3, "itemName": "Advertencia", "image": "../../../assets/icons/yellow-alert.png" }
    ];
    this.dropdownSettings = {
      singleSelection: true,
      text: "opcion",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      autoPosition:false,
      position:"bottom"
    };
  }

  get QuestionsAndAnswers() {
    return this.tableForm.get('QuestionsAndAnswers') as FormArray;
  }

  ngOnInit(): void {

    this.tableForm = this.fb.group({
      init_date: new FormControl(),
      finish_date: new FormControl(),
      QuestionsAndAnswers: this.fb.array([]),
    });

    this.tableForm.valueChanges.subscribe((value: any) => {
      //const filter = { ...value, name: value.fechaEmision.trim().toLowerCase() } as string;
      //this.dataSource.filter = filter;
    });
     this.followService.getFollowClientAll()
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.registers = new Array<any>();
          this.registers = data;

          this.dataSource = new MatTableDataSource(this.registers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

         this.create(this.registers)
        },
        error: error => {
          this.error = error;
        }
      });
  }

  create(item:any){
    for (let i = 0; i < item.length; i++) {
      this.QuestionsAndAnswers.push(
        this.fb.group({
          observations: new FormControl(),
          atention:new FormControl(),
          resolutor: new FormControl()
        })
      );
    }
  }
  save() {   
    const follow_inside: Array<FollowInsideModel> = this.registers.map((data: any, index:number) => {      
      const follow = this.tableForm.value.QuestionsAndAnswers[index].observations;
      const atention = this.tableForm.value.QuestionsAndAnswers[index].atention;
      const resolutor = this.tableForm.value.QuestionsAndAnswers[index].resolutor;
      return {
        idUser: data.profile.idUser,
        nombre: data.profile.nombre,
        apellido: data.profile.apellido,
        cargo: data.profile.cargo,
        cliente: data.profile.cliente,
        finalClient: data.profile.finalClient,
        clientContact: data.company.contacto_cliente,
        dateContract: data.company.fecha_contrato,
        contractFinalClient: data.company.contacto_cliente_final,
        follow: follow,
        atention: atention,
        resolutor: resolutor
      }
    });
    this.notification_message=follow_inside;
    const init=this.tableForm.get('init_date')?.value;
    const finish=this.tableForm.get('finish_date')?.value;
    const randomCode = this.generateRandomCode();
    const data_toSave: FollowModel = {
      followId: randomCode,
      follow: follow_inside,
      init_date: init,
      final_date: finish
    }
    this.data=data_toSave;
    this.notifications();
    this.followService.followSave(data_toSave)
      .pipe(first())
      .subscribe({
        next: (data) => {          
          this.openSnackBar(
            'Su registro se guardo exitosamente!',
            'OK'
          );
        },
        error: error => {
          this.error = error;
        }
      });
  }
  notifications(){    
    const not = this.notification_message.map((data:any) => {
      return {
        message: data.follow,
        destination: data.resolutor
      };
    }).filter((item:any) => item.message !== null && item.destination !== null);
    this.sharedService.setNotification=not;
  }
  generateRandomCode(): string {
    const prefix = 'fll-';
    const numbers = Math.floor(Math.random() * 90000) + 10000; // Genera un número aleatorio de 5 dígitos

    return prefix + numbers.toString();
  }


  exportExcel(): void {
    const element = document.getElementById('registersCustomer');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'registros.xlsx');
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
