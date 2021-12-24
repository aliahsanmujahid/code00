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

  constructor(private http: HttpClient) { }
  
  
  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  }
  getSellers(page : number) {
    
    var response = this.sellerCache.get(Object.values(['seller' +page]).join('-'));
    if (response) {
      //console.log("sellerCache--",this.sellerCache);
      return of(response);
    }
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/getsellers/'+ page).pipe(map(response => {
      this.sellerCache.set(Object.values(['seller' +page]).join('-'), response);
      return response;
    }))
  }

  updateUserRoles(email: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + email + '?roles=' + roles, {});
  }
}
