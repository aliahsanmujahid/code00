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
  constructor(public roleService: RoleService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  updateUserRoles(){
    this.roleService.updateUserRoles(this.roles.email,this.roles.roles).subscribe(res => {
       //console.log(res);
    })
  }

  getUsersWithRoles() {
    this.roleService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }

}
