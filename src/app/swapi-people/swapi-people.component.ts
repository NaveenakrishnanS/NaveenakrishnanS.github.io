import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-swapi-people',
  templateUrl: './swapi-people.component.html',
  styleUrls: ['./swapi-people.component.scss'],
})
export class SwapiPeopleComponent {
  dataSource!: MatTableDataSource<displayData>;
  columns: string[] = ['name', 'height', 'mass', 'hair_color', 'eye_color','birth_year','gender','created','edited'];
  pageIndex = 0;
  pageSize = 10;
  totalItems = 82;
  isLoading=false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading=true
    const url = `https://swapi.dev/api/people/?page=${this.pageIndex + 1}`;
    this.http.get<{ results: displayData[] }>(url)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.results);
        this.isLoading=false;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.fetchData();
  }
}

export interface displayData {
  column: [{
    name: string
    height: string
    mass: string
    hair_color: string
    skin_color: string
    eye_color: string
    birth_year: string
    gender: string
    created: string
    edited: string
  }];
}
