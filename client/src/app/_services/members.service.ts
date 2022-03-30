import { HttpClient, HttpHeaders, HttpParams, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = user;
      this.userParams = new UserParams(user);
    })

  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params:UserParams){
    this.userParams = params
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams
  }

  // getMembers(){
  getMembers(userParams : UserParams){    
    //if(this.members.length > 0) return of(this.members); //busca el member si lo tiene en el array,   
    var response = this.memberCache.get(Object.values(userParams).join('-')); //Esto se fija si lo guardamos el userparams en cache
    
    if(response){
      return of(response)
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users',params,this.http)
      .pipe(map(response =>{
        this.memberCache.set(Object.values(userParams).join('-'), response); //aca lo guardamos en memberCache
        return response;
      }))

    //return this.http.get<Member[]>(this.baseUrl + 'users').pipe( //uso el pipe y el map porque devuelve un observable
      // map(members => {
      //   this.members = members;
      //   return members;
      // })
    //);
  }

  getMember(username:String){
    // const member = this.members.find(x => x.username === username);
    // if(member !== undefined) return of(member)
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), []) //creamos un array y lo concatenamos con los elem. Esto es para achicar a un array
      .find((member: Member) => member.username === username);

    if (member){
      return of(member)
    }

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

  addLike(username : string){
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate', predicate)
    // return this.http.get(this.baseUrl + 'likes?=' + predicate); //modificamos esto porque devolvia un objeto
    // return this.http.get<Partial<Member[]>>(this.baseUrl + 'likes?predicate=' + predicate); //le aclaramos que devuelva un members
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes',params, this.http);
  }

  
}
