import {Component} from '@angular/core';

@Component({
    selector:'nk-skills',
    templateUrl:'./skills.component.html',
    styleUrls:['./skills.component.scss']
})

export class SkillsComponent{
    skillsets: {skill: string, value: number}[]= [{skill:"HTML/CSS/Javascript",value:75},{skill:"C/C++",value:72},{skill:"JAVA",value:77},{skill:"PYTHON",value:75},{skill:"MYSQL",value:70},{skill:"FLUTTER/DART",value:70},{skill:"ETHICAL HACKING",value:50},]
}