import { Component } from '@angular/core';

@Component({
  selector: 'nk-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  titles: string[] = [
    'Real-Time Communication System Powered by AI for Specially Abled',
    'Hybrid-Multiple Cryptography',
    'Implementation of Hybrid-Multiple Cryptography On E2E Chatting Application'
  ];
  contents: string[] = [
    "The project's objective is to create an interactive system that can convert sign language for the deaf and dumb into understandable spoken English. We Have Built an CNN Model Fitted in Flask to Convert American Sign Language(ASL) To English Speech.",
    "This Project introduces an new approach that seeks to incorporate both Hybrid cryptography and Multiple cryptography as a way to provide an enhanced layer of security by combining both of their strengths while also mitigating the drawbacks that are present in each individual approach.",
    "This Project implements an new approach that seeks to incorporate both Hybrid cryptography and Multiple cryptography on an End-to-End Chatting Application which is built by Flutter and Firebase, making it cross-platform also. "
  ];
}
