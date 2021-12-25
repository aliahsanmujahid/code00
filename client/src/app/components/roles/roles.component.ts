import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { RoleService } from 'src/app/_services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  users: Partial<User[]>;
  roles = {
    email: '',
    roles:[]
  }; 
  totaluser = 0
  constructor(public roleService: RoleService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
    this.getmemberscount();
  }

  updateUserRoles(){
    this.roleService.updateUserRoles(this.roles.email,this.roles.roles).subscribe(res => {

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

}
