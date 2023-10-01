import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { HomeComponent } from './home.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
    declarations:[
        HomeComponent
    ],
    imports:[
        CommonModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule
    ],
    exports:[
        HomeComponent
    ]
})

export class HomeModule{
    
}