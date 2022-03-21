import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]>;

  constructor(private membersService: MembersService) { } //estoy trayendo el service de members.service.ts

  ngOnInit(): void {
    this.members$ = this.membersService.getMembers()
    //this.loadMembers(); no lo usa mas porque lo hace directo del service.
  }
/*
  loadMembers(){
    this.membersService.getMembers().subscribe(members=> {
      this.members = members;
    })
  }
*/
}
