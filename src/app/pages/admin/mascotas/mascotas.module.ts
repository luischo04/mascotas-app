import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MascotasRoutingModule } from './mascotas-routing.module';
import { MascotasComponent } from './mascotas.component';
import { MaterialModule } from '@app/material.modules';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MascotasComponent
  ],
  imports: [
    CommonModule,
    MascotasRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class MascotasModule { }
