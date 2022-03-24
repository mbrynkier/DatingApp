import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  // model: any = {}; //se comenta porque se esta usando ahora el registerForm
  registerForm: FormGroup; //Se agrego para crear Reactive Forms que se agrega en App.Module.ts
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18)
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'], //Se informa que es requerido
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]], //Que sea requerido minimo de 4 y 8 de largo
      confirmPassword: ['', [Validators.required, this.matchValues('password')]] //Que es requerido
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => { //ingresamos esto para que el valor password se actualice cuando se cambie
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn{ //genere otro control para que el confirm password sea igual que el password
    return(control: AbstractControl) =>{
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  register(){    
    
    //this.accountService.register(this.model).subscribe(response =>{
      this.accountService.register(this.registerForm.value).subscribe(response =>{  
      this.router.navigateByUrl('/members');
      this.cancel();
    }, error =>{
      this.validationErrors = error;
      //console.log(error);
      //this.toastr.error(error.error);
    })
    
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}

/*ejemplo de html antes de crear el text-input.component para ahorrar codigo
  <div class="form-group">
        <!-- <input type="text" class="form-control" name="username" [(ngModel)]="model.username" placeholder="Username"> -->
        <input 
            [class.is-invalid] = 'registerForm.get("username").errors && registerForm.get("username").touched'
            type="text" 
            class="form-control" 
            formControlName='username' 
            placeholder="Username">
        <div class="invalid-feedback">Please enter a username</div>
    </div>

    <div class="form-group">
        <!-- <input type="password" class="form-control" name="password" [(ngModel)]="model.password" placeholder="Password"> -->
        <input 
            [class.is-invalid] = 'registerForm.get("password").errors && registerForm.get("password").touched'
            type="password" 
            class="form-control" 
            formControlName='password' 
            placeholder="Password">
        <div *ngIf="registerForm.get('password').hasError('required')" class="invalid-feedback">Please enter a password</div>
        <div *ngIf="registerForm.get('password').hasError('minlength')" class="invalid-feedback">Password must be at least 4 characters</div>
        <div *ngIf="registerForm.get('password').hasError('maxlength')" class="invalid-feedback">Password must be at most 8 characters</div>
    </div>

    <div class="form-group">
        
        <input 
            [class.is-invalid] = 'registerForm.get("confirmPassword").errors && registerForm.get("confirmPassword").touched'
            type="password" 
            class="form-control" 
            formControlName='confirmPassword' 
            placeholder="Confirm Password">
        <div *ngIf="registerForm.get('confirmPassword').hasError('required')" class="invalid-feedback">Please enter a confirm password</div>
        <div *ngIf="registerForm.get('confirmPassword').hasError('isMatching')" class="invalid-feedback">Confirm Password must match password</div>        
    </div>
*/