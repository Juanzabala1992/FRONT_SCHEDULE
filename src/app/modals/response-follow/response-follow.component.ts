import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-response-follow',
  templateUrl: './response-follow.component.html',
  styleUrls: ['./response-follow.component.css']
})
export class ResponseFollowComponent{
  @Input() data:any;
  
  error:any;
  dropdownList: any = [];
  dropdownSettings: any = {};
  constructor(private notificationsService:NotificationsService,
    private _snackBar: MatSnackBar,
    public ngbModal: NgbModal
    ){
      this.dropdownList = [
        { "id": 1, "itemName": "En curso", "image": "../../../assets/icons/curse.svg" },
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
  
  followForm = new FormGroup({
    response: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    atention: new FormControl('', { nonNullable: true, validators: [Validators.required] })    
  });
  ngOnInit(): void {
    this.notificationsService.putNotification(this.data)
      .pipe(first())
      .subscribe({
          next: () => {          
          },
          error: error => {
              this.error = error; 
              this.openSnackBar(
                this.error.error.message,
                'OK'
              );          
          }
      });
      console.log("this.data --> ", this.data);
  }
  close(){
    this.ngbModal.dismissAll("close");
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar']
    });
  }
}
