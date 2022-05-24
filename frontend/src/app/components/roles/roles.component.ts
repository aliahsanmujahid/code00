import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { RoleService } from 'src/app/_services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  users: Partial<User[]>;
  membersemailsphone: Partial<User[]>;
  
  roles = {
    email: '',
    roles:[]
  }; 
  totaluser = 0
  constructor(private router: Router,public roleService: RoleService,private toastr: ToastrService ) { }

  ngOnInit(): void {
    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(!user){
      this.router.navigateByUrl('');
    }
    this.getUsersWithRoles();
    this.getmemberscount();
  }

  updateUserRoles(){
    this.roleService.updateUserRoles(this.roles.email,this.roles.roles).subscribe(res => {
        this.toastr.info("User Role Updated");
    })
  }

  getUsersWithRoles() {
    this.roleService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }
  getmemberscount(){
    this.roleService.getmemberscount().subscribe(count => {
      this.totaluser = count;
    })
  }
  getmembersemail(){
    this.membersemailsphone = [];
    this.roleService.getmembersemail().subscribe(res => {
      this.membersemailsphone = res;
    })
  }
  getmembersephone(){
    this.membersemailsphone = [];
    this.roleService.getmembersphone().subscribe(res => {
      this.membersemailsphone = res;
    })
  }

}
