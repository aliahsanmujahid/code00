import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/_services/category.service';
import { OrderService } from './../../_services/order.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketTotals } from 'src/app/_models/basket';
import { IOrder, IOrderItem } from 'src/app/_models/order';
import { BasketService } from 'src/app/_services/basket.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  user: User;
  UserId: Number;
  ordersucces = false;
  alert = false;
  bkashpay = false;
  rocketpay = false;
  nagadpay = false;
  cashondelevarypay = false;
  districts: any = [];
  upazilla: any = [];
  getutality: any = [];
  address: any = [];
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotals>;
  

  orderCreate: IOrder = {
    name: '',
    phone: '',
    address: '',
    district: '',
    upazila: '',
    cashOnDelevary:'',
    bkash: '',
    bkashTransactionID: '',
    rocket: '',
    rocketTransactionID: '',
    nagad: '',
    nagadTransactionID: '',
    seller_id:0,
    orderItemDto:[]
  }

  createaddress: any = { };
  
  
  constructor(public categoryService: CategoryService,public accountService: AccountService,public basketService: BasketService,
    public orderService: OrderService,private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    // window.scrollTo(0, 0);
    this.QuantityCheck();
    this.accountService.currentUser$.subscribe( x => {
      this.orderCreate.name = x.displayName;
      this.user = x;
      this.UserId = x.id;
    });

     if(this.user){
      var address = JSON.parse(localStorage.getItem('address'+this.user.id));
      var disupa = JSON.parse(localStorage.getItem('disupa'));
      if(address && disupa){
        this.address = address;
        this.districts = disupa;
        //console.log("pppppppppppppppp",address);
        this.orderCreate.phone = this.address.phone;
        this.orderCreate.address = this.address.userAddress;
        this.orderCreate.district = this.address.district;
        this.orderCreate.upazila = this.address.upazila;


        const selected = this.districts.find(m => m.name === this.orderCreate.district);
        /// console.log("district selected--",selected);
        this.upazilla = selected ? selected.subDto : [];

      }else{
          this.accountService.getaddress().subscribe(res =>{
            if(res){
            this.address = res;
            console.log("addresssssssssssss====",this.address);
            this.orderCreate.phone = this.address.phone;
            this.orderCreate.address = this.address.userAddress;
            this.orderCreate.district = this.address.district;
            this.orderCreate.upazila = this.address.upazila;
            localStorage.setItem('address'+this.UserId , JSON.stringify(res));
            console.log("Order Create000000====",this.orderCreate);
            }else{
              this.address = null;
            }
       }); 

       this.categoryService.getdisrictsandupazilla().subscribe(res =>{
        localStorage.setItem('disupa', JSON.stringify(res));
        this.districts = res;
        const selected = this.districts.find(m => m.name === this.orderCreate.district);
        this.upazilla = selected ? selected.subDto : [];
        console.log("+++++++++++++upazila res", this.upazilla);
      });
      
      }
     }
    
      
      if(!localStorage.getItem('basket')){
        this.router.navigateByUrl('');
      }else{
        this.basketService.getBasket();
        this.basket$ = this.basketService.basket$;
        this.basketTotal$ = this.basketService.basketTotal$;
        this.setOrderItems();
      }
    
      this.getUtails();
    
  }
  QuantityCheck(){
    const items = JSON.parse(localStorage.getItem('basket'));
    if(items){
    //Same Shop Checking
    if(items.shopId == this.UserId){
      this.basketService.deleteBasket();
      this.router.navigateByUrl('');
      this.toastr.warning('You Can,t Buy Your Own Product');
    }else{  
    this.orderService.orderQuantityCheck(items.items).subscribe(res =>{
      if(res == true){
        this.basketService.deleteBasket();
        this.router.navigateByUrl('');
      }
     /// console.log("QuantityCheck----------------------",res);
    })
    }
    }
  }


  onChange(){
    const selected = this.districts.find(m => m.name === this.orderCreate.district);
    //console.log(this.orderCreate.district);
    this.upazilla = selected ? selected.subDto : [];
  }

  hidealert(){
    this.alert = !this.alert;
  }
  vieworder(){
    this.router.navigate(['order', {  'customerid': this.user.id,'neworder':true}]);
  }

  
  setOrderItems(){
    const items = JSON.parse(localStorage.getItem('basket'));
    
    items.items.forEach(item =>{
       
     const OrderItem: IOrderItem ={
        id: 0,
        productName: '',
        price: 0,
        quantity: 0,
        color_id:0,
        color_name:'',
        size_id:0,
        size_name:'',
      }
      //console.log(item);

      OrderItem.id = item.id;
      OrderItem.productName = item.productName;
      OrderItem.price = item.price;
      OrderItem.quantity = item.quantity;
      if(item.color.length !== 0){
      //console.log("Color Ace");
      OrderItem.color_id = item.color[0].id;
      OrderItem.color_name = item.color[0].name;
      }
      if(item.size.length !== 0){
        OrderItem.size_id = item.size[0].id;
        OrderItem.size_name = item.size[0].name;
      //console.log("Size Ace");
      }
  
      
      this.orderCreate.orderItemDto.push(OrderItem);
      
      
     
    });
    this.orderCreate.seller_id = items.shopId;
    //console.log(this.orderCreate);
    
    
  }

  getUtails(){
    const utails = JSON.parse(localStorage.getItem('utails'));
    if(utails){
      this.getutality = utails;
      //console.log("utails catch----------",utails);
    }else{
      this.categoryService.getUtails().subscribe( res => {
      this.getutality = res;
      localStorage.setItem('utails', JSON.stringify(res));
      //console.log("utails res----------",res);
    })
  }
  }

  cashondelevary(){
    this.orderCreate.cashOnDelevary = "CashOnDelevary"
    this.cashondelevarypay = true;
    this.bkashpay = false;
    this.nagadpay = false;
    this.rocketpay =false;
    this.alert =false;
    this.orderCreate.bkash = '',
    this.orderCreate.bkashTransactionID = '',
    this.orderCreate.nagad = '',
    this.orderCreate.nagadTransactionID = '',
    this.orderCreate.rocket = '',
    this.orderCreate.rocketTransactionID = ''
  }
  bkash(){
    this.bkashpay = true;
    this.nagadpay = false;
    this.rocketpay =false;
    this.cashondelevarypay = false;
    this.orderCreate.bkash = '',
    this.orderCreate.bkashTransactionID = '',
    this.orderCreate.nagad = '',
    this.orderCreate.nagadTransactionID = '',
    this.alert =false;
    this.orderCreate.rocket = '',
    this.orderCreate.rocketTransactionID = ''

  }
  rocket(){
    this.bkashpay = false;
    this.nagadpay = false;
    this.rocketpay =true;
    this.cashondelevarypay = false;
    this.alert =false;
    this.orderCreate.bkash = '',
    this.orderCreate.bkashTransactionID = '',
    this.orderCreate.nagad = '',
    this.orderCreate.nagadTransactionID = '',
    this.orderCreate.rocket = '',
    this.orderCreate.rocketTransactionID = ''
  }
  nagad(){
    this.bkashpay = false;
    this.nagadpay = true;
    this.rocketpay =false;
    this.cashondelevarypay = false;
    this.alert =false;
    this.orderCreate.bkash = '',
    this.orderCreate.bkashTransactionID = '',
    this.orderCreate.nagad = '',
    this.orderCreate.nagadTransactionID = '',
    this.orderCreate.rocket = '',
    this.orderCreate.rocketTransactionID = ''
  }

  order(){
    console.log("EEEEEEEEEE",this.address );
    if(
      this.orderCreate.cashOnDelevary == '' && 
      this.orderCreate.rocket == ''&& this.orderCreate.rocketTransactionID == '' &&
      this.orderCreate.bkash == '' && this.orderCreate.bkashTransactionID == '' && 
      this.orderCreate.nagad == '' && this.orderCreate.nagad == '' ){
         this.alert = true;
    }else{
     // console.log("------------",this.orderCreate);
      this.orderService.orderCreate(this.orderCreate).subscribe(res =>{
      //console.log(res);
      this.basketService.deleteBasket();
      this.ordersucces = true;
    })
    if(this.address == null  && !this.user.roles.some(x => x === "Seller")){
      console.log("---------Adress Null----------");
      this.createaddress = {
        phone: this.orderCreate.phone,
        userAddress: this.orderCreate.address,
        district: this.orderCreate.district,
        upazila: this.orderCreate.upazila,
      }
      this.accountService.create(this.createaddress).subscribe(res=>{
            localStorage.setItem('address'+this.user.id , JSON.stringify(res));
            console.log("----------setting new Address----------");
        });
    }
    
    }


    window.scrollTo(0, 0);
  }

}
