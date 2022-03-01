import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating app';
  users: any; //Any dice que puede ser cualquier tipo string,int etc....

  constructor(private http: HttpClient) {} //Injectable class

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe(Response => {
      this.users = Response;
    }, error => {
      console.log(error);
    })
  }
}


