import { OrderService } from './../../_services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  user: User;
  noorder = false;
  throttle = 0;
  distance = 1;
  page:number = 1;
  orderview  = false;
  stopscroll  = false;
  search:string;
  neworder = false;

  orders: any = [];
  singleorder: any = [];
  sellerid: number;
  customerid: number;
  status="All";

  constructor(private route: ActivatedRoute,
    private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      window.scrollTo(0, 0);
      this.stopscroll = false;
    });
    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(user){
      this.user = user;
      this.route.params.subscribe(params => {
        if (Object.keys(params).length === 2) {
          this.neworder = true;
        }else{
          this.neworder = false;
        }
        
      });
      this.route.params.subscribe(params => {
        if(params.codes){
         this.sellerid = params.codes;
         this.customerid = null;
         this.getorders();
        }
        if(params.codec){
         this.customerid = params.codec;
         this.sellerid = null;
         this.getorders();
        }
      
    });
    }else{
      this.router.navigateByUrl('');
    }

  }

  viewOrder(id:number){
    this.singleorder = [];
    this.singleorder = this.orders.filter(i => i.id == id);

    this.orderview = true;
    window.scrollTo(0, 0);
  }
  // deleteOrder(id:number){

  //   this.orderService.deleteOrder(id).subscribe( res=>{
  //     this.orders.splice(this.orders.findIndex(m => m.id === id), 1);
  //   });

  // }


  getOrdersByStatus(status:string){
    this.orders = [];
    this.status = status;
    if(this.neworder){
      this.neworder = false;
    }
    this.getorders();
  }
  
  changeStatus(id:number,status:string){
   this.orderService.changeStatus(id,this.user.id,status).subscribe(res => {
      var newo =  this.orders.find(i => i.id == id);
      newo.status = status;
   });

  }
  changecutomerstatus(id:number,status:string){
    this.orderService.changecutomerstatus(id,this.user.id,status).subscribe(res => {
       var newo =  this.orders.find(i => i.id == id);
       newo.status = status;
    });
 
   }
  SearchOrder(){
    this.orders = [];
    this.noorder = false;
    this.orderview = false;
    this.stopscroll = false;
    this.orderService.getOrderById(this.search).subscribe(res =>{
      this.orders.push(res);
      if(res == null){
        this.orders = null;
        this.noorder = true;
        this.stopscroll = true;
      }else{
        this.noorder = false;
        this.stopscroll = true;
      }
    });

  }


  getorders(){
    this.orders = [];
    this.page =1;
    this.orderview  = false;
    this.noorder = false;
    this.stopscroll = false;

    if(this.sellerid){
       this.orderService.getSellerOrders(this.sellerid,this.page,this.status).subscribe(res =>{
         this.orders  = res;
         if(this.orders.length === 0 || res.length < 10 ){
          this.noorder = true;
          this.stopscroll = true;
        }else{
          this.noorder = false;
          this.stopscroll = false;
        }
       });
    }
    if(this.customerid){

       this.orderService.getCustomerOrders(this.customerid,this.page,this.status,this.neworder).subscribe(res =>{
         this.orders  = res;
         this.neworder = false;
         if(this.orders.length === 0 || res.length < 10 ){
          this.noorder = true;
          this.stopscroll = true;
        }else{
          this.noorder = false;
          this.stopscroll = false;
        }
       });

    }
  }

  
  onScroll(): void {
    if(this.orderview == false && this.stopscroll == false){
      this.noorder = false;
    
      if(this.sellerid){
        this.orderService.getSellerOrders(this.sellerid,++this.page,this.status).subscribe( res => {
          this.orders.push(...res);
          if(res.length === 0 || res.length < 10 ){
            this.noorder = true;
            this.stopscroll = true;
          }else{
            this.noorder = false;
            this.stopscroll = false;
          }
         
         });
      }
      if(this.customerid){
        this.orderService.getCustomerOrders(this.customerid,++this.page,this.status,this.neworder).subscribe( res => {

          this.orders.push(...res);
          if(res.length === 0 || res.length < 10 ){
            this.noorder = true;
            this.stopscroll = true;
          }else{
            this.noorder = false;
            this.stopscroll = false;
          }
         
         });
      }
    }
    }
  

}
