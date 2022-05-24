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
  sellerName:string;
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
    district: 'select',
    upazila: 'select',
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
    window.scrollTo(0, 0);
    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(user){
      this.orderCreate.name = user.displayName;
      this.user = user;
      this.UserId = user.id;
    }
    this.QuantityCheck();


     if(this.user){
      var address = JSON.parse(localStorage.getItem('address'+this.user.id));
      var disupa = JSON.parse(localStorage.getItem('disupa'));
      if(address && disupa){
        this.address = address;
        this.districts = disupa;

        this.orderCreate.phone = this.address.phone;
        this.orderCreate.address = this.address.userAddress;
        this.orderCreate.district = this.address.district;
        this.orderCreate.upazila = this.address.upazila;


        const selected = this.districts.find(m => m.name === this.orderCreate.district);

        this.upazilla = selected ? selected.subDto : [];

      }else{
          this.accountService.getaddress().subscribe(res =>{
            if(res){
            this.address = res;
            this.orderCreate.phone = this.address.phone;
            this.orderCreate.address = this.address.userAddress;
            this.orderCreate.district = this.address.district;
            this.orderCreate.upazila = this.address.upazila;
            localStorage.setItem('address'+this.UserId , JSON.stringify(res));

            this.categoryService.getdisrictsandupazilla().subscribe(res =>{
              localStorage.setItem('disupa', JSON.stringify(res));
              this.districts = res;
              if(this.address !== null){
                const selected = this.districts.find(m => m.name === this.address.district);
                this.upazilla = selected ? selected.subDto : [];
              }

            });
            }else{
              this.categoryService.getdisrictsandupazilla().subscribe(res =>{
                localStorage.setItem('disupa', JSON.stringify(res));
                this.districts = res;
                if(this.address !== null){
                  const selected = this.districts.find(m => m.name === this.address.district);
                  this.upazilla = selected ? selected.subDto : [];
                }
              });
              this.address = null;
            }
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
      this.orderService.orderQuantityCheck(items.items).subscribe(res =>{
        if(res == true){
          this.basketService.deleteBasket();
          this.router.navigateByUrl('');
          this.toastr.info('Product Not Available');
        }
        if(this.user){
          if (this.user.roles.includes('Admin')
          || this.user.roles.includes('Seller')
          || this.user.roles.includes('Moderator')){
            this.basketService.deleteBasket();
            this.router.navigateByUrl('');
            this.toastr.warning('You Can,t Buy Product');
          }
        }
      })
    }
  }


  onChange(){
    const selected = this.districts.find(m => m.name === this.orderCreate.district);

    this.upazilla = selected ? selected.subDto : [];
  }

  hidealert(){
    this.alert = !this.alert;
  }
  vieworder(){
    this.router.navigate(['order', {  'codec': this.user.id,'neworder':true}]);
  }
  loginpage(){
    this.router.navigate(['auth', {  'login':true }]);

  }
  signuppage(){
    this.router.navigate(['auth', {  'signup':true }]);
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

      OrderItem.id = item.id;
      OrderItem.productName = item.productName;
      OrderItem.price = item.price;
      OrderItem.quantity = item.quantity;
      if(item.color.length !== 0){

      OrderItem.color_id = item.color[0].id;
      OrderItem.color_name = item.color[0].name;
      }
      if(item.size.length !== 0){
        OrderItem.size_id = item.size[0].id;
        OrderItem.size_name = item.size[0].name;

      }


      this.orderCreate.orderItemDto.push(OrderItem);



    });
    this.orderCreate.seller_id = items.shopId;
    this.sellerName = items.sellername;


  }

  getUtails(){
    const utails = JSON.parse(localStorage.getItem('utails'));
    if(utails){
      this.getutality = utails;
    }else{
      this.categoryService.getUtails().subscribe( res => {
      if(res){
        this.getutality = res;
        localStorage.setItem('utails', JSON.stringify(res));
      }
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

    console.log("submitting----------------");
    if(this.orderCreate.district.toLowerCase() == 'select' || this.orderCreate.upazila.toLowerCase() == 'select'){
     this.toastr.error("Select Delivery Address");
    }else{
    if(
      this.orderCreate.cashOnDelevary == '' &&
      this.orderCreate.rocket == ''&& this.orderCreate.rocketTransactionID == '' &&
      this.orderCreate.bkash == '' && this.orderCreate.bkashTransactionID == '' &&
      this.orderCreate.nagad == '' && this.orderCreate.nagad == '' ){
        console.log("submitting----------------");
         this.alert = true;
    }else{
      this.orderService.orderCreate(this.orderCreate).subscribe(res =>{
      this.basketService.deleteBasket();
      this.ordersucces = true;
      window.scrollTo(0, 0);
    })
   if(this.address == null  && !this.user.roles.some(x => x === "Seller")){
      this.createaddress = {
        phone: this.orderCreate.phone,
        userAddress: this.orderCreate.address,
        district: this.orderCreate.district,
        upazila: this.orderCreate.upazila,
      }
      this.accountService.createaddress(this.createaddress).subscribe(res=>{
            localStorage.setItem('address'+this.user.id , JSON.stringify(res));

        });
    }
  }

    }


  }

}
