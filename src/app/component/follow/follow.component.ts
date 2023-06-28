import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FollowService } from 'src/app/services/follow.service';
import { RegisterService } from 'src/app/services/register.service';
import { first } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})

export class FollowComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  data:any;
  displayedColumns: string[] = ['recurso','cliente','clientefinal', 'contratocliente','contratoclientefinal',
  'fechacontrato','seguimiento', 'puntodeatencion', 'responsable'];
  error:any;
  dataSourcesActivities=new MatTableDataSource<any>();
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) set matSort(sort: MatSort) {    
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;  

    
  constructor(private router:Router, private followService:FollowService, 
    private registerService:RegisterService, private sharedService:SharedService){
    this.dropdownList = [
      {"id":1,"itemName":"Incidencia", "image":"../../../assets/icons/alert-icon.png"},
      {"id":2,"itemName":"Advertencia", "image":"../../../assets/icons/green_alert.png"},
      {"id":3,"itemName":"Resuelto", "image":"../../../assets/icons/yellow-alert.png"} 
    ];

  this.dropdownSettings = { 
          singleSelection: true, 
          text:"opcion",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          classes:"myclass custom-class"
    };  
  }

  ngOnInit():void{
    this.registerService.getAllUsers()
    .pipe(first())
    .subscribe({
        next: (data) => {             
            console.log("data ---> ", data)
        },
        error: error => {
            this.error = error;            
        }
    });
  }

  onItemSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any){
    console.log(items);
  }
  onDeSelectAll(items: any){
    console.log(items);
  }

  exportExcel(): void {
 
    const tableData: any[] = [];
    const headers: string[] = [
      'Nombre',
      'Fecha inicio',
      'Fecha fin',
      'Numero de documento',
      'Actividades',
      'Observaciones del desarrollador',
      'Responsable cliente',
      'Total horas'
    ];
  
    this.data.forEach((row: any) => {
      const activitiesData: string[] = [];
  
      if (Array.isArray(row.actividades)) {
        row.actividades.forEach((activity: any) => {
          const activityData: string = `${activity.id}, ${activity.data}, ${activity.hours}, ${activity.initial_date}, ${activity.final_date}`;
          activitiesData.push(activityData);
        });
      }
  
      const rowData: any[] = [
        row.nombre,
        row.fecha_inicio,
        row.fecha_fin,
        row.numero_de_documento,
        activitiesData.join('\n'),
        row.observaciones,
        row.responsable_cliente,
        row.total_horas
      ];
  
      tableData.push(rowData);
    });
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...tableData]);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'tabla.xlsx');
  }
}
