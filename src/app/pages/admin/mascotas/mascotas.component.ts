import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@app/pages/auth/auth.service';
import { DialogoConfirmacionComponent } from '@app/shared/component/dialogo-confirmacion/dialogo-confirmacion.component';
import { UserResponse } from '@app/shared/models/user.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MascotasService } from '../services/mascotas.service';
import { ModalFormularioComponent } from './components/modal-formulario/modal-formulario.component';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.scss']
})
export class MascotasComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();

  displayedColumns: string[] = [
    'nombreMascota',
    'nomRaza',
    'fechaAdopcion',
    'descripcion',
    'editar',
    'eliminar'
  ];
  lstUsers: UserResponse[] = [];

  constructor(private mascotasSvc: MascotasService, private dialog: MatDialog, private _snackbar: MatSnackBar, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.listMascotas();
  }

  private listMascotas(): void {
    const result = this.authSvc.userValue?.username!;
    this.mascotasSvc.lista(result)
    .pipe(takeUntil(this.destroy$))
    .subscribe(users => this.lstUsers = users);
  }

  onOpenModal(user = {}): void {
    const dialogRef = this.dialog.open(ModalFormularioComponent, {
      disableClose: true,
      data: {title: 'Nuevo usuario', user}
    });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      if(result){
        this.listMascotas();
      }
    });
  }

  onDelete(cveMascota: number) {
    this.dialog.open(DialogoConfirmacionComponent, {
      disableClose: true,
      data: "Estas seguro de querer eliminarlo"
    }).beforeClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.mascotasSvc.delete(cveMascota)
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
              if (result) {
                this._snackbar.open(result.message, '', {
                  duration: 6000
                });
                this.listMascotas();
              }
            });
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
