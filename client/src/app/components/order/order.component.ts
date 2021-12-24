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
      console.log("user ace=============");
      this.route.params.subscribe(params => {
        if (Object.keys(params).length === 2) {
          console.log("params true");
          this.neworder = true;
        }else{
          this.neworder = false;
        }
        
      });
      this.route.params.subscribe(params => {
        if(params.sellerid){
         this.sellerid = params.sellerid;
         this.customerid = null;
         this.getorders();
        }
        if(params.customerid){
         this.customerid = params.customerid;
         this.sellerid = null;
         this.getorders();
        }
      
    });
    }else{
      console.log("user nai=============");
      this.router.navigateByUrl('');
    }

  }

  viewOrder(id:number){
    this.singleorder = [];
    console.log("-----------id",id);
    console.log("-----------all orders",this.orders);
    this.singleorder = this.orders.filter(i => i.id == id);

    console.log("===========Single Order=======",this.singleorder);
    this.orderview = true;
  }
  // deleteOrder(id:number){

  //   this.orderService.deleteOrder(id).subscribe( res=>{
  //     this.orders.splice(this.orders.findIndex(m => m.id === id), 1);
  //     console.log("----------Deleted--------");
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
      console.log("res coming........",res);
      var newo =  this.orders.find(i => i.id == id);
      newo.status = status;
      console.log("after change status",newo);
   });

  }
  SearchOrder(){
    this.orders = [];
    this.noorder = false;
    this.orderview = false;
    this.stopscroll = false;
    this.orderService.getOrderById(this.search).subscribe(res =>{
      this.orders.push(res);
      console.log("yyyyy",res);
      console.log(this.orders);
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
      // console.log("this Page--------",this.page);
      // console.log("this seller id-----------",this.sellerid);
      // console.log("this status-----------",this.status);
       this.orderService.getSellerOrders(this.sellerid,this.page,this.status).subscribe(res =>{
         this.orders  = res;
         console.log(res);
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
      // console.log("Page--------",this.page);
      // console.log("customer id-----------",this.customerid);
      // console.log("status-----------",this.status);

       this.orderService.getCustomerOrders(this.customerid,this.page,this.status,this.neworder).subscribe(res =>{
         this.orders  = res;
         console.log("order res-------",res);
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
          //console.log("res",res);
          console.log("Page--------",this.page);
          this.orders.push(...res);
          console.log("-----------all orders",this.orders);
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
          //console.log("res",res);
          console.log("Page--------",this.page);
          this.orders.push(...res);
          console.log("-----------scroll all orders",this.orders);
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
