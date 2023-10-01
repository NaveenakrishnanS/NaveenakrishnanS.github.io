import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutModule } from './about/about.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { HomeModule } from './home/home.module';
import { NavbarModule } from './navbar/navbar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SwapiPeopleModule } from './swapi-people/swapi-people.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarModule,
    HomeModule,
    AboutModule,
    SkillsModule,
    ProjectsModule,
    ContactModule,
    BrowserAnimationsModule,
    FormsModule,
    SwapiPeopleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
