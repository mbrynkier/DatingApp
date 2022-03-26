import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // members$: Observable<Member[]>;
  members: Member[];
  pagination: Pagination; //Agregaos la pagination
  userParams: UserParams;
  user: User;
  genderList = [{value: 'male', display:'Males'}, {value: 'female', display:'Females'}]

  constructor(private membersService: MembersService) { //estoy trayendo el service de members.service.ts
    this.userParams = this.membersService.getUserParams();
    
  }

  ngOnInit(): void {
    this.loadMembers();
    // this.members$ = this.membersService.getMembers()
    //this.loadMembers(); no lo usa mas porque lo hace directo del service.
  }

  loadMembers(){
    this.membersService.setUserParams(this.userParams);
    this.membersService.getMembers(this.userParams).subscribe(response=> {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }
/*
  loadMembers(){
    this.membersService.getMembers().subscribe(members=> {
      this.members = members;
    })
  }
*/

  resetFilters(){
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any){
    this.userParams.pageNumber = event.page;
    this.membersService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
