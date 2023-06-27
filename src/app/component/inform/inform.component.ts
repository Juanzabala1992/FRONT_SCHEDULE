import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-inform',
  templateUrl: './inform.component.html',
  styleUrls: ['./inform.component.css']
})
export class InformComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  data:any;
  displayedColumns: string[] = ['nombres','fechainicio','fechafin', 'numerodocumento','activities','observaciones','responsablecliente', 'totalhoras'];
  error:any;
  displayedColumnsActi: string[] = ['id','data','hours', 'initial_date','final_date'];
  dataSourcesActivities =new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) set matSort(sort: MatSort) {    
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;  
  constructor(private dashboardService:DashboardService, private _liveAnnouncer: LiveAnnouncer,){}

  ngOnInit():void{
    this.dashboardService.getAll()
    .pipe(first())
    .subscribe({
        next: (data:any) => { 
          this.data=data;          
          this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;              
        },
        error: (error:any) => {
            this.error = error;            
        }
    });
  }
  exportExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'tabla.xlsx');
  }
  

  announceSortChange(sortState: Sort) {
    // Avisa el cambio en el ordenamiento
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}


