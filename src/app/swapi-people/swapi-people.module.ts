import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapiPeopleComponent } from './swapi-people.component';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [SwapiPeopleComponent],
  imports: [MatPaginatorModule, MatTableModule, CommonModule, HttpClientModule,MatProgressSpinnerModule],
  exports: [SwapiPeopleComponent],
  providers: [],
})
export class SwapiPeopleModule {}


