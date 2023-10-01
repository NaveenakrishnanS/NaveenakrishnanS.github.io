import {NgModule} from '@angular/core';
import {SkillsComponent} from './skills.component';
import {CommonModule} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';

@NgModule({
    declarations:[
        SkillsComponent
    ],
    imports:[
        CommonModule,MatProgressBarModule,MatCardModule
    ],
    exports:[
        SkillsComponent
    ]
})
export class SkillsModule{

}