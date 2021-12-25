import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  baseUrl = environment.apiUrl;
  favproductCache = new Map();
  constructor(private http: HttpClient,private router: Router) { }

  getfavProducts(){
    var response = this.favproductCache.get(Object.values('[userProducts]').join('-'));
   if (response) {
     return of(response);
   }
   return this.http.get<Product[]>(this.baseUrl + 'product/getFavProducts/').pipe(map(response => {
     this.favproductCache.set(Object.values('[userProducts]').join('-'), response);
     return response;
   }))
 }

 isFavorited(id: number) {
  var response = this.favproductCache.get(id);
  if (response || response === false && response !== null ) {
    return of(response);
  }
  return this.http.get<boolean>(this.baseUrl + 'product/isFavorited/' + id).pipe(map(response => {
    this.favproductCache.set(id, response);
    return response;
  }))
}
addFav(id: number) {
  this.favproductCache.set(id, true);
  return this.http.post(this.baseUrl + 'product/addFav/' + id, {});
}
removeFav(id: number) {
  
  this.favproductCache.set(id, false);
  return this.http.post(this.baseUrl + 'product/removeFav/' + id, {});
}



}
