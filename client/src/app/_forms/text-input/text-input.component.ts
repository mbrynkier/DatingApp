import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
//Este componente es para borrar codigo repetitivo hecho por el Reactive Forms(usado en register.component)
export class TextInputComponent implements ControlValueAccessor {//se borro el onInit
  @Input() label:string;
  @Input() type= 'text';

  constructor(@Self() public ngControl: NgControl) { //lo inyecta localmente con el self
    this.ngControl.valueAccessor = this;
  } 

  writeValue(obj: any): void {
    
  }

  registerOnChange(fn: any): void {
    
  }

  registerOnTouched(fn: any): void {
    
  }  

  

}
