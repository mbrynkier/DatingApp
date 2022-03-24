import { HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers(){
    if(this.members.length > 0) return of(this.members); //busca el member si lo tiene en el array, 
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe( //uso el pipe y el map porque devuelve un observable
      map(members => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username:String){
    const member = this.members.find(x => x.username === username);
    if(member !== undefined) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/'+ username);
  }

  updateMember(member:Member){ //es para hacer un update lo usa en  member-edit.component.ts
    return this.http.put(this.baseUrl + 'users',member).pipe( //Esto va a UserController.cs - Se usa el put
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {}); //Esto esta en UserController.cs
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + "users/delete-photo/" + photoId) //Esto esta en UserController
  }
}
