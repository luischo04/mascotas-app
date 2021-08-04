import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserResponse } from '@app/shared/models/user.interface';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  getAll(): void {}

  getById(): void {}

  new(): void {}

  update(): void {}
}
