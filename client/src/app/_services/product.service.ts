import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IProduct, Product } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.apiUrl;
  skip = environment.skip;
  // mainproductCache = new Map();
  // mainproductCachetwo = new Map();
  newproduct = [];
  
  
  productCache = new Map();
  constructor(private http: HttpClient,private router: Router) { }


  createProduct(product: IProduct){
    return this.http.post<IProduct>(this.baseUrl + 'Product/create', product);
  }
  getProduct(id: string) {
    const product = [...this.productCache.values()]
    .reduce((arr, elem) => arr.concat(elem), [])
    .find((product: Product) => product.id === Number(id));

  if (product) {
    return of(product);
  }

  return this.http.get<Product>(this.baseUrl + 'Product/' + Number(id));
  }
  
  getProducts(page:number){

    var response = this.productCache.get(page);
    
    if(page == 1 && response){
      
      this.newproduct = [];
      for (var i = 0; i < this.skip; i++) {

        this.newproduct.push(response[i]);
      }
     
      return of(this.newproduct);
    }
    if (response && page !== 1) {
      return of(response);
    }else{
      return this.http.get<Product[]>(this.baseUrl + 'product/getProducts/'+page).pipe(map(response => {
        
          this.productCache.set(page, response);

          return this.productCache.get(page);
        
      }))
    }

   

 }


  getuserProducts(id,page){
     var response = this.productCache.get(Object.values(['userProducts'+ id+page]).join('-'));
     if(page == 1 && response){
      this.newproduct = [];
      for (var i = 0; i < this.skip; i++) {
        if(response[i]){
          this.newproduct.push(response[i]);
        }
      }
     
      return of(this.newproduct);
    }
    if (response && page !== 1) {
      return of(response);
    }else{
      return this.http.get<Product[]>(this.baseUrl + 'product/getUserProducts/' + id +"/"+ page).pipe(map(response => {
        this.productCache.set(Object.values(['userProducts'+ id+page]).join('-'), response);
        return response;
      }))
    }
  }

 deleteProduct(id:number){
  return this.http.delete(this.baseUrl + 'product/deleteproduct/'+id);
 }
 updateproduct(id:number,product: IProduct){
  return this.http.put(this.baseUrl + 'product/updateproduct/'+id,product);
 }









 getcateProducts(id: number,page){
  var response = this.productCache.get(Object.values(['cate'+id+page]).join('-'));
  if(page == 1 && response){
    this.newproduct = [];
    for (var i = 0; i < this.skip; i++) {
      if(response[i]){
        this.newproduct.push(response[i]);
      }
    }
   
    return of(this.newproduct);
  }
  if (response && page !== 1) {
    return of(response);
  }else{
    return this.http.get<Product[]>(this.baseUrl + 'product/getCateProduct/' + id +"/"+ page).pipe(map(response => {
      this.productCache.set(Object.values(['cate'+id+page]).join('-'), response);
      return response;
    }))
  }
}

getsubcateProducts(id: number,page){
  var response = this.productCache.get(Object.values(['subcate'+id+page]).join('-'));
  if(page == 1 && response){
    this.newproduct = [];
    for (var i = 0; i < this.skip; i++) {
      if(response[i]){
        this.newproduct.push(response[i]);
      }
    }
   
    return of(this.newproduct);
  }
  if (response && page !== 1) {
    return of(response);
  }else{
    return this.http.get<Product[]>(this.baseUrl + 'product/getsubCateProduct/' + id + "/"+ page).pipe(map(response => {
      this.productCache.set(Object.values(['subcate'+id+page]).join('-'), response);
      return response;
    }))
  }
}
getsubsubcateProducts(id: number,page){
  var response = this.productCache.get(Object.values(['catesubsubProducts'+id+page]).join('-'));
  if(page == 1 && response){
    this.newproduct = [];
    for (var i = 0; i < this.skip; i++) {
      if(response[i]){
        this.newproduct.push(response[i]);
      }
    }
   
    return of(this.newproduct);
  }
  if (response && page !== 1) {
    return of(response);
  }else{
    return this.http.get<Product[]>(this.baseUrl + 'product/getsubsubCateProduct/' + id + "/"+ page).pipe(map(response => {
      this.productCache.set(Object.values(['catesubsubProducts'+id+page]).join('-'), response);
      return response;
    }))
  }
}
searchProducts(text: string,page){
  var response = this.productCache.get(Object.values(['searchProducts'+text.toLowerCase()+page]).join('-'));
  if(page == 1 && response){
    this.newproduct = [];
    for (var i = 0; i < this.skip; i++) {
      if(response[i]){
        this.newproduct.push(response[i]);
      }
    }
   
    return of(this.newproduct);
  }
  if (response && page !== 1) {
    return of(response);
  }else{
    return this.http.get<Product[]>(this.baseUrl + 'product/searchProduct/' + text + "/" + page).pipe(map(response => {
      this.productCache.set(Object.values(['searchProducts'+text.toLowerCase()+page]).join('-'), response);
      return response;
    }))
  }
}



}
