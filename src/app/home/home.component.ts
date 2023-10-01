import { Component } from '@angular/core';

@Component({
  selector: 'nk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  roles: string[] = ['A Coder', 'A Developer', 'A Software Engineer'];
  currentIndex: number = 0;
  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.roles.length;
    }, 1500);
  }
  value: string="linkedin"
    OnClicking(event:any){
        this.value=(event.srcElement.alt);
        console.log(this.value);
    }
}
