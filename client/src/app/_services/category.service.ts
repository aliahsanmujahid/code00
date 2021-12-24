import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  creatmenu(data){
    return this.http.post(this.baseUrl + 'category/createmenu/', data);
  }
  creatsubmenu(data){
    return this.http.post(this.baseUrl + 'category/createsubmenu/', data);
  }
  createsubsubmenu(data){
    return this.http.post(this.baseUrl + 'category/createsubsubmenu/', data);
  }
  createDistrict(data){
    return this.http.post(this.baseUrl + 'category/createdisrict/', data);
  }
  createUpazilla(data){
    return this.http.post(this.baseUrl + 'category/createupazilla/', data);
  }
  getdisrictsandupazilla(){
    return this.http.get(this.baseUrl + 'category/getdisrictsandupazilla/');
  }
  
  createUtails(data){
    return this.http.post(this.baseUrl + 'category/createUtails/', data);
  }
  getUtails(){
    return this.http.get(this.baseUrl + 'category/getUtails/');
  }
  



  setchangeid(){
    return this.http.post(this.baseUrl + 'category/setchangeid/', {});
  }
  getchangeid() {
   
      return this.http.get<number>(this.baseUrl + 'Category/getchangeid/');
     
  }




  getCategories() {
    return this.http.get(this.baseUrl + 'Category/getmenu/');
  }
  getmainmenu() {
    return this.http.get(this.baseUrl + 'Category/getmainmenu/');
  }
  getsubmenu() {
    return this.http.get(this.baseUrl + 'Category/getsubmenu/');
  }
  getsubsubmenu() {
    return this.http.get(this.baseUrl + 'Category/getsubsubmenu/');
  }
  getsubmenuid(id: number) {
    return this.http.get(this.baseUrl + 'Category/getsubcate/' + id);
  }
  getsubsubmenuid(id: number) {
    return this.http.get(this.baseUrl + 'Category/getsubsubcate/' + id);
  }
 
  delete1(id:number){
    return this.http.delete(this.baseUrl + 'Category/deletemenu/' + id);
  }
  delete2(id:number){
    return this.http.delete(this.baseUrl + 'Category/deletesubmenu/' + id);
  }
  delete3(id:number){
    return this.http.delete(this.baseUrl + 'Category/deletesubsubmenu/' + id);
  }
}
