import { User } from './../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  sellerCache = new Map();

  baseUrl = environment.apiUrl;
  skip = environment.skip;

  temparray = [];

  constructor(private http: HttpClient) { }
  
  
  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  }
  getmemberscount() {
    return this.http.get<number>(this.baseUrl + 'admin/getmemberscount');
  }

  getSellers(page : number) {
    
    var response = this.sellerCache.get(Object.values(['seller' +page]).join('-'));
   
    if(page == 1 && response){
      
      this.temparray = [];
      for (var i = 0; i < this.skip; i++) {
        if(response[i]){
          this.temparray.push(response[i]);
        }
      }
     
      return of(this.temparray);
    }
    if (response && page !== 1) {
      return of(response);
    }else{
      return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/getsellers/'+ page).pipe(map(response => {
        this.sellerCache.set(Object.values(['seller' +page]).join('-'), response);
        return response;
      }))
    }
  }

  getuserbyid(id : number) {
    
    var response = this.sellerCache.get(Object.values(['getuserbyid' +id]).join('-'));
    if (response) {
      return of(response);
    }
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/getuserbyid/'+ id).pipe(map(response => {
      this.sellerCache.set(Object.values(['getuserbyid' +id]).join('-'), response);
      return response;
    }))
  }

  getmembersemail() {
    
    var response = this.sellerCache.get(Object.values(['getmembersemail']).join('-'));
    if (response) {
      return of(response);
    }
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/getmembersemail/').pipe(map(response => {
      this.sellerCache.set(Object.values(['getmembersemail']).join('-'), response);
      return response;
    }))
  }
  
  getmembersphone() {
    var response = this.sellerCache.get(Object.values(['getmembersphone']).join('-'));
    if (response) {
      return of(response);
    }
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/getmembersphone/').pipe(map(response => {
      this.sellerCache.set(Object.values(['getmembersphone']).join('-'), response);
      return response;
    }))
  }

  updateUserRoles(email: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + email + '?roles=' + roles, {});
  }
}
