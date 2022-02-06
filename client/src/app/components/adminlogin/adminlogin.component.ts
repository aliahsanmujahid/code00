import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {

  constructor(private socialAuthService: SocialAuthService,
    private toastr: ToastrService,private router: Router) { }

  ngOnInit(): void {
    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(user){
      this.router.navigateByUrl('profile');
    }
  }

  loginWithGoogle(): void{
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then(data =>{
      localStorage.setItem("g_auth",JSON.stringify(data));
      this.router.navigateByUrl('profile');
    })
    .catch(error => {
      if(error.error){
        this.toastr.error("PopUp Closed Try Again");
        return;
      }else{
        this.toastr.info("Loading Try Again");
        return;
      }
  });
}

}
