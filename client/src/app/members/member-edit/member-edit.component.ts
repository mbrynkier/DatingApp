import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm; //Esto lo hago para que lo pueda usar dentro de un metodo, en este caso update member.
  member:Member;
  user: User;
  //Esto es para que si quiere salir de la pantalla le avise.
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private memberService:MembersService, private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member => 
      {this.member = member});
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(()=>{//Esto lo usa en member.service.ts
      this.toastr.success('Profile updated succesfully');
      this.editForm.reset(this.member);//paso el this.member, porque sino no guarda el miembro
    });     
  }
}
