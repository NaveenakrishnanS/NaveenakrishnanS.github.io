import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContactComponent} from './contact.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon, MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations:[
        ContactComponent
    ],
    imports:[
        CommonModule,MatCardModule,MatInputModule,MatFormFieldModule,MatIconModule
    ],
    exports:[
        ContactComponent
    ]
})

export class ContactModule{
    
}