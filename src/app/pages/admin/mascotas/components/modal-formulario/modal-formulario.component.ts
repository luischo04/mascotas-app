import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MascotasService } from '@app/pages/admin/services/mascotas.service';
import { AuthService } from '@app/pages/auth/auth.service';
import { Raza } from '@app/shared/models/raza.interface';
import { User, UserResponse } from '@app/shared/models/user.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
enum Action{
  EDIT = "edit",
  NEW = "new"
}

@Component({
  selector: 'app-modal-formulario',
  templateUrl: './modal-formulario.component.html',
  styleUrls: ['./modal-formulario.component.scss']
})
export class ModalFormularioComponent implements OnInit, OnDestroy {

    // Variables
    actionTODO = Action.NEW;
    private destroy$ = new Subject<any>();
    razas : Raza[] = [];

    mascotaForm = this.fb.group({
      cveMascota: [''],
      cvePropietario : [this.authSvc.userValue?.cveUsuario],
      nombreMascota : ['', [Validators.required]],
      fechaAdopcion : ['', [Validators.required]],
      raza : ['', [Validators.required]]
    })

    constructor(public dialogRef: MatDialogRef<ModalFormularioComponent> ,@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private MascotasSvc: MascotasService, private _snackBar: MatSnackBar, private authSvc: AuthService) { 

     }

  ngOnInit(): void {
    this.getRazas();

    if(this.data?.user.hasOwnProperty("cveMascota")){
      this.actionTODO = Action.EDIT;
      this.data.title = "Editar usuario"
      this.mascotaForm.updateValueAndValidity();
      this.editar();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete()
  }

  private getRazas(): void {
    this.MascotasSvc.getRaza()
    .pipe(takeUntil(this.destroy$))
    .subscribe(razas => this.razas = razas)
  }

  onSave(): void{
    if(this.mascotaForm.invalid){
      return;
    }

    const formValue = this.mascotaForm.value;

    if(this.actionTODO == Action.NEW) {
      // Insert
      const { cveMascota, ...rest } = formValue
      this.MascotasSvc.new(rest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this._snackBar.open(result.message, '', {
          duration: 6000
        });
        this.dialogRef.close(true);
      });
    } else {
      // Update
      const { ...rest } = formValue;
      this.MascotasSvc.update(rest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this._snackBar.open(result.message, '', {
          duration: 6000
        });
        this.dialogRef.close(true);  
      });
    }

    console.log(this.MascotasSvc);
  }

  private editar(): void {
    this.mascotaForm.patchValue({
      cveMascota : this.data?.user.cveMascota,
      nombreMascota : this.data?.user.nombreMascota,
      fechaAdopcion : this.data?.user.fechaAdopcion,
      raza : this.data?.user.raza
    });
  }

  getErrorMessage(field: string): string{
    let message = "";

    const element = this.mascotaForm.get(field);

    if(element?.errors){
      const messages: any = {
        required : "Este campo es requerido"
      };

      const errorKey = Object.keys(element?.errors).find(Boolean);
      message = String(messages[String(errorKey)]);
    }

    return message;
  }

}
