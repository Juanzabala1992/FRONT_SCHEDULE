import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';


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
          
          
        },
        error: error => {
            this.error = error;            
        }
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
