import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectsComponent} from './projects.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
    declarations:[
        ProjectsComponent
    ],
    imports:[
        CommonModule,MatCardModule
    ],
    exports:[
        ProjectsComponent
    ]
})

export class ProjectsModule{
    
}