import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { Model, ModelL, ModelS } from 'src/app/_models/model';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  model: Model ={
    username: '',
    email: '',
    image:''
  };

  modelsign: ModelS = {
    username: '',
    phonenumber:null,
    password:'',
    image:'../../../assets/demo.jpg'
  };
  modellogin: ModelL ={
    phonenumber:null,
    password:'',
  };
  phonenumber:number;

  params: any = {};
  loginpage = false;
  signuppage = false;
  forgetpage = false;


  constructor(public accountService: AccountService,private socialAuthService: SocialAuthService,
    private route: ActivatedRoute,private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(user){
      this.router.navigateByUrl('profile');
    }
    
    this.route.params.subscribe(params => {
      
      window.scrollTo(0, 0);

      if (Object.keys(params).length === 0) {
          this.router.navigateByUrl('');
      }else{
        this.params = params;
        if(params.login === 'true'){
          this.modellogin ={
            phonenumber:null,
            password:'',
          };
           this.phonenumber = null;
           this.loginpage = true;
           this.signuppage = false;
           this.forgetpage = false;
        }
        if(params.signup === 'true'){
          this.modelsign = {
            username: '',
            phonenumber:null,
            password:'',
            image:'../../../assets/demo.jpg'
          };
          this.phonenumber = null;
          this.signuppage = true;
          this.loginpage = false;
          this.forgetpage = false;
        }
        if(params.forget === 'true'){
          this.modellogin ={
            phonenumber:null,
            password:'',
          };
          this.phonenumber = null;
          this.forgetpage = true;
          this.signuppage = false;
          this.loginpage = false;
        }
        
      }
      
    });


  }


  // loginWithGoogle(): void{
  //     this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then(data =>{
  //       localStorage.setItem("g_auth",JSON.stringify(data));
  //       this.router.navigateByUrl('profile');
  //     })
  //     .catch(error => {
  //       if(error.error){
  //         this.toastr.error("PopUp Closed Try Again");
  //         return;
  //       }else{
  //         this.toastr.info("Loading Try Again");
  //         return;
  //       }
  //   });
  // }


  
  // login() {
  //   this.accountService.login(this.model).subscribe(response => {
  //      if(response){
  //           this.router.navigateByUrl('profile');
  //      }
  //   }, error => {
  //   })
  // }

  loginview(){
    this.router.navigate(['auth', {  'login':true }]);
   }
   signupview(){
    this.router.navigate(['auth', {  'signup':true }]);
   }
  forgetview(){
   this.router.navigate(['auth', {  'forget':true }]);
  }





  signup(){
    this.modelsign.phonenumber = '0'+this.phonenumber.toString();

    if(this.modelsign.phonenumber.length == 11){
      const text = this.modelsign.phonenumber;
      for (let i = 0; i < 2; i++) {
        if(text.charAt(0) !== '0' ){
          this.toastr.error("Phone Number Invalid");
          return;
        }
        if(text.charAt(1) !== '1' ){
          this.toastr.error("Phone Number Invalid");
          return;
        }else{
          this.accountService.signup(this.modelsign).subscribe(response => {
             if(response){
              this.router.navigateByUrl('profile');
             }
          }, error => {
                this.toastr.error("User Already Exist");
          })
          return;
        }
      }
    }else{
      this.toastr.error("Phone Number Invalid");
    }
    
  }

  forgetpass(){
    this.modellogin.phonenumber = '0'+this.phonenumber.toString();

    if(this.modellogin.phonenumber.length == 11){
      const text = this.modellogin.phonenumber;
      for (let i = 0; i < 2; i++) {
        if(text.charAt(0) !== '0' ){
          this.toastr.error("Phone Number Invalid");
          return;
        }
        if(text.charAt(1) !== '1' ){
          this.toastr.error("Phone Number Invalid");
          return;
        }else{
          this.accountService.forgetpass(this.modellogin).subscribe(response => {
            if(response){
              this.router.navigateByUrl('profile');
             }
          }, error => {
            this.toastr.error("Wrong Number or Password");
          })
          return;
        }
      }
    }else{
      this.toastr.error("Phone Number Invalid");
    }
  }
  phonelogin(){
    this.modellogin.phonenumber = '0'+this.phonenumber.toString();

    if(this.modellogin.phonenumber.length == 11){
      const text = this.modellogin.phonenumber;
      for (let i = 0; i < 2; i++) {
        if(text.charAt(0) !== '0' ){
          this.toastr.error("Phone Number Invalid");
          return;
        }
        if(text.charAt(1) !== '1' ){
          this.toastr.error("Phone Number Invalid");
          return;
        }else{
          this.accountService.phonelogin(this.modellogin).subscribe(response => {
            if(response){
              this.router.navigateByUrl('profile');
             }
          }, error => {
            this.toastr.error("Wrong Number or Password");
          })
          return;
        }
      }
    }else{
      this.toastr.error("Phone Number Invalid");
    }
  }
  
}
