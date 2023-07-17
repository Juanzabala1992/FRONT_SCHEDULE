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
  @Input() where:string='';
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
    total_horas:"Totalidad horas",
    activitiesExt:"Actividades", 
    hoursExt:"Horas Extras", 
    minutesExt:"Minutos de las horas Extras", 
    act_final_dateExt:"Fecha final de alguna de las actividades de las extras", 
    act_initial_dateExt:"Fecha inicial de alguna de las actividades de las extras", 
  }
  traslate_register:any={
    cliente:"Cliente", 
    cliente_final:"Cliente final",   
    direccion:"Dirección", 
    email:"Email", 
    nombre:"Nombre", 
    apellido:"Apellido", 
    numero_de_documento:"Número de documento", 
    tipo_de_documento:"Tipo de documento", 
    cargo:"Cargo", 
    pais:"País",
    telefono:"Teléfono"
  }
  traslate_clients:any={
    client:"Cliente", 
    contacto_cliente:"Contacto cliente",   
    fecha_contrato:"Fecha de contrato"
  }
  constructor(
    public ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    if(this.where=='hoursregister'){
      this.labels = this.data.map((item:any)=>{      
        return this.traslate[item];
      });
    }
    if(this.where=='register'){
      this.labels = this.data.map((item:any)=>{      
        return this.traslate_register[item];
      });
    }
    if(this.where=='company'){
        this.labels = this.data.map((item:any)=>{      
          return this.traslate_clients[item];
        });
    }
  
    
    const uniqueArray = this.labels.filter((value: string, index: number, self: string | any[]) => {
      return self.indexOf(value) === index;
    });
    this.labels=uniqueArray;    
  }
  close(){
    this.ngbModal.dismissAll("close");
  }
}
