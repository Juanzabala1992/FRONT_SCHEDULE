import {
    Directive, ElementRef, HostListener, Input, OnInit, Renderer2, Optional, OnDestroy
 } from '@angular/core';
 
 @Directive({
   selector: '[appInputMaxLength]'
 })
 export class InputMaxLengthDirective  {
   @Input() appInputMaxLength: number=0;
 
   constructor(private el: ElementRef) { }
 
   @HostListener('input') onInput(event:any) 
   {
     const length = this.el.nativeElement.value ? this.el.nativeElement.value.length : 0;
 
     if (length > this.appInputMaxLength)     
       this.el.nativeElement.value = this.el.nativeElement.value.substr(0, length - 1);
   }
 }