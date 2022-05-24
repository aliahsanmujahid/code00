import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  public currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,private router: Router) { }



  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        this.setCurrentUser(response);
        return response;
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.router.navigateByUrl('shop');
          return user;
        }
      })
    )
  }


  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('eidhatuser', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  setUser(user: User) {

    this.setCurrentUser(user);

    // if (user) {
    //   if(user.roles.some(x => x === "Seller")){
    //     // this.router.navigateByUrl('/user/seller/'+user.id);
    //   }
    //   if(user.roles.some(x => x === "Member")){
    //     this.router.navigateByUrl('');
    //   }
    // }
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }


  logout() {
    window.scrollTo(0, 0);
    localStorage.removeItem('eidhatuser');
    this.currentUserSource.next(null);
    location.reload();
  }
  logout2() {
    localStorage.removeItem('eidhatuser');
    this.currentUserSource.next(null);
  }

  createaddress(model) {
    return this.http.post(this.baseUrl + 'address/createaddress', model);
  }
  changeName(name) {
    return this.http.post(this.baseUrl + 'Account/setname/' + name.name , {});
  }
  getaddress() {
    return this.http.get(this.baseUrl + 'address/getaddress/');
  }






  signup(model: any) {
    return this.http.post(this.baseUrl + 'account/signup', model).pipe(
      map((response: User) => {
        this.setCurrentUser(response);
        return response;
      //  location.reload();
      })
    )
  }
  forgetpass(model: any) {
    return this.http.post(this.baseUrl + 'account/forgetpass', model).pipe(
      map((response: User) => {
        this.setCurrentUser(response);
        return response;
        // location.reload();
      })
    )
  }
  phonelogin(model: any) {
    return this.http.post(this.baseUrl + 'account/phonelogin', model).pipe(
      map((response: User) => {
        this.setCurrentUser(response);
        return response;
        // location.reload();
      })
    )
  }






}
