import { CategoryService } from './../../_services/category.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  noaddress = false;
  changenam = false;
  createaddress: any = { };
  name: any = { };
  useraddress:any = [];
  districts: any = [];
  upazilla: any = [];
  userId:number;

  constructor(public accountService: AccountService,public categoryService: CategoryService,public router: Router) { }

  ngOnInit(): void {
    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(user){
      this.userId = user.id;
      this.getaddress();
    }else{
          this.router.navigateByUrl('');
    }
    const disupa = JSON.parse(localStorage.getItem('disupa'));
    if(disupa){
      this.districts = disupa;
      const selected = this.districts.find(m => m.name === this.useraddress.district);
      this.upazilla = selected ? selected.subDto : [];
    }else{
      this.categoryService.getdisrictsandupazilla().subscribe(res =>{
        localStorage.setItem('disupa', JSON.stringify(res));
        this.districts = res;
        const selected = this.districts.find(m => m.name === this.useraddress.district);
        this.upazilla = selected ? selected.subDto : [];
      });
    }
  }
  ondisChange(){

      const selected = this.districts.find(m => m.name === this.createaddress.district);
      
      this.createaddress.upazila = "None";
      
      this.createaddress.districtId = selected ? selected.id : 0;

      this.upazilla = selected ? selected.subDto : [];
  }
  onupaChange(){
      const selected = this.upazilla.find(m => m.name === this.createaddress.upazila);
      this.createaddress.upazilaId =  selected ? selected.id : 0;
  }
  seeaddress(){
    if(this.useraddress !== null){
      this.createaddress=this.useraddress;
    }
    this.noaddress = !this.noaddress;
  }
  changename(){
       this.changenam = !this.changenam;
  }

  setAddress(){
    this.accountService.create(this.createaddress).subscribe(res=>{
        localStorage.setItem('address'+this.userId , JSON.stringify(res));
        this.useraddress = res;
        this.noaddress = !this.noaddress;
    });
  }
  setName(){
    this.accountService.changeName(this.name).subscribe(res =>{
     const user: User = JSON.parse(localStorage.getItem('eidhatuser')); 
     user.displayName = this.name.name;
     localStorage.setItem('eidhatuser', JSON.stringify(user));
     this.accountService.setUser(user);
     this.changenam = !this.changenam;
    });

  }

  getaddress(){
     const address = JSON.parse(localStorage.getItem('address'+this.userId));
     if(address){
      this.useraddress = address;
     }else{
      this.accountService.getaddress().subscribe(res =>{
          this.useraddress = res;
          localStorage.setItem('address'+this.userId , JSON.stringify(res));
     });
     }
  }

}
