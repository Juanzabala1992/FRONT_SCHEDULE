import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvalidModel } from 'src/app/model/invalidModel';

@Component({
  selector: 'app-invalidregister',
  templateUrl: './invalidregister.component.html',
  styleUrls: ['./invalidregister.component.css']
})
export class InvalidregisterComponent {
  @Input() data:any;
  labels:any;
  traslate:any={
    activities:"Actividades", 
    hours:"Horas", 
    minutes:"Minutos", 
    act_final_date:"Fecha final de alguna de las actividades", 
    act_initial_date:"Fecha inicial de alguna de las actividades", 
    initial_date:"Fecha incial", 
    final_date:"Fecha final", 
    client:"Cliente", 
    final_client:"Cliente final", 
    total_horas:"Totalidad horas"
  }
  constructor(
    public ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    this.labels = this.data.map((item:any)=>{      
      return this.traslate[item];
    });
    
    const uniqueArray = this.labels.filter((value: string, index: number, self: string | any[]) => {
      return self.indexOf(value) === index;
    });
    this.labels=uniqueArray;
    console.log(this.labels);
  }
  close(){
    this.ngbModal.dismissAll("close");
  }
}
