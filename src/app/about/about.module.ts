import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,MatCardModule
  ],
  exports:[
    AboutComponent
  ]
})
export class AboutModule { }
