import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  id_user!:string;
  id$: any;
  error:any;
  history:any;
  registers: any[]=[];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'id',
    'cliente',
    'iduser',
    'fechainicio',
    'fechafin',
    'numerodocumento',
    'observaciones',
    'responsablecliente',
    'totalhoras'
  ];

  form = new FormGroup({
    cliente: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fecha_inicio: new FormControl('', { nonNullable: true, validators: [Validators.required] })    
  });

  constructor(private dashboardService:DashboardService, private sharedService:SharedService){
    this.id$=sharedService.getId;
  }

  ngOnInit(): void {
    this.id$.subscribe((id:string)=>{
      this.id_user=id;
    });

    this.dashboardService.getUser(this.id_user)
    .pipe(first())
    .subscribe({
        next: (data) => { 
           
            this.history=data;
            this.registers = new Array<any>();
            this.registers = data;

            this.dataSource = new MatTableDataSource(this.registers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          
            this.dataSource.filterPredicate = function (data: any, filterValue: any) {
               const a = !filterValue.cliente.toLowerCase() || data.cliente?.toLowerCase().includes(filterValue.cliente);
               
               const fechaInicio = filterValue.fecha_inicio;
                const fecha = new Date(fechaInicio);

                const dia = fecha.getDate()+1;
                const mes = fecha.getMonth() + 1; // Se suma 1 porque los meses en JavaScript son indexados desde 0
                const anio = fecha.getFullYear();

                const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;

                console.log(fechaFormateada); // Salida: '24/07/2023'
               const b = !fechaFormateada.toLowerCase() || data.fecha_inicio?.toLowerCase().includes(fechaFormateada);     
              return a && b;
            };

        },
        error: error => {
            this.error = error;            
        }
    });

    this.form.valueChanges.subscribe((value: any) => {
      
      const filter = { ...value, name: value.cliente.trim()?.toLowerCase() } as string;      
      this.dataSource.filter = filter;
      console.log("filter ", filter);
    });


   
  }
  exportExcel(): void {
    const element = document.getElementById('registersCustomer');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'registros.xlsx');
  }
}
