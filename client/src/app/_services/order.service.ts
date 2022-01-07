import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IOrder } from '../_models/order';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;
  skip = environment.skip;
  filterorder = [];


  customerorderCache = new Map();
  
  constructor(private http: HttpClient) { }

  orderCreate(orderform) {
    return this.http.post(this.baseUrl + 'orders/order', orderform);
  }

  orderQuantityCheck(items) {
    return this.http.post(this.baseUrl + 'orders/ordercheck', items);
  }

  getOrderById(id: string,sellerid: number) {
  return this.http.get<IOrder[]>(this.baseUrl + 'orders/getOrderById/' + id +'/' + sellerid);
  }
  deleteOrder(id: number) {
    return this.http.delete(this.baseUrl + 'orders/deleteOrder/' + id);
  }
  getSellerOrders(id: number,page: number,status:string) {
    return this.http.get<IOrder[]>(this.baseUrl + 'orders/getSellerOrders/' + id +'/' +page+'/'+status);
  }
  getCustomerOrders(id: number,page: number,status:string,neworder) {
    if(neworder){
      this.customerorderCache = new Map();
    }
    var response = this.customerorderCache.get(Object.values(page+status).join('-'));
    if(page == 1 && response){
       this.filterorder = [];
       for (var i = 0; i < this.skip; i++) {
         if(response[i]){
           this.filterorder.push(response[i]);
         }
       }
      
       return of(this.filterorder);
     }
     if (response && page !== 1) {
       return of(response);
     }else{
      return this.http.get<IOrder[]>(this.baseUrl + 'orders/getCustomerOrders/' + id +'/' +page+'/'+status).pipe(map(response => {
        this.customerorderCache.set(Object.values(page+status).join('-'), response);
        return response;
      }))
    }

  }


  changeStatus(id: number,userid: number,status:string) {
    return this.http.put(this.baseUrl + 'orders/changeStatus/' + id +'/' + userid +'/' +status,{});
  }


  changecutomerstatus(id: number,userid: number,status:string) {
    return this.http.put(this.baseUrl + 'orders/changecutomerstatus/' + id +'/' + userid +'/' +status,{});
  }
  
  

}
