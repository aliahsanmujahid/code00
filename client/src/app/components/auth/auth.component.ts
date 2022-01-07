import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { Model, ModelL, ModelS } from 'src/app/_models/model';
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

    this.accountService.currentUser$.subscribe( x => {
      if(x){
         this.router.navigateByUrl('profile');
      }
    });


  }


  loginWithGoogle(){
    
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(d =>{
        this.model.username = d.name;
        this.model.email = d.email;
        this.model.image = d.photoUrl;
        this.login();
      })
      .catch(error => {
        if(error.error){
          this.toastr.error("PopUp Closed Try Again");
        }else{
          this.toastr.error("Try Again");
        }
      });
  
    // this.socialAuthService.authState.subscribe((user) => {
      
    //   // this.model.username = user.name;
    //   // this.model.email = user.email;
    //   // this.model.image = user.photoUrl;
    //   // this.login();
    //   // console.log(user);
      
    // })

  }


  
  login() {
    this.accountService.login(this.model).subscribe(response => {
    }, error => {
    })
  }

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
    this.accountService.signup(this.modelsign).subscribe(response => {
    }, error => {
      this.toastr.error("Wrong Number or Password");
    })
  }

  forgetpass(){
    this.modellogin.phonenumber = '0'+this.phonenumber.toString();
    this.accountService.forgetpass(this.modellogin).subscribe(response => {
    }, error => {
      this.toastr.error("Wrong Number or Password");
    })
  }
  phonelogin(){
    this.modellogin.phonenumber = '0'+this.phonenumber.toString();
    this.accountService.phonelogin(this.modellogin).subscribe(response => {
    }, error => {
      this.toastr.error("Wrong Number or Password");
    })
  }
  
}
