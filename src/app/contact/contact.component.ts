import {Component} from '@angular/core';

@Component({
    selector:'nk-contact',
    templateUrl:'./contact.component.html',
    styleUrls:['./contact.component.scss']
})

export class ContactComponent{
    value: string=""
    OnClicking(event:any){
        this.value=(event.srcElement.alt);
        console.log(this.value);
    }
}