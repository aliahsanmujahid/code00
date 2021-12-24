import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/_services/category.service';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {

  district: any ={ };
  upazilla: any ={ };
  districts: any = [];


  constructor(public categoryService: CategoryService) { }

  ngOnInit(): void {
    const disupa = JSON.parse(localStorage.getItem('disupa'));
    if(disupa){
      this.districts = disupa;
      console.log(disupa);
    }else{
      this.categoryService.getdisrictsandupazilla().subscribe(res =>{
        localStorage.setItem('disupa', JSON.stringify(res));
        this.districts = res;
        console.log(res);
      });
    }
  }

  createDistrict(){
    localStorage.removeItem('disupa');
    console.log(this.district);
    this.categoryService.createDistrict(this.district).subscribe( res => {
      this.districts = res;
      console.log("district----------",res);
    }),
    error => {
      console.log(error);
    };
  }

  createUpazilla(){
    console.log(this.district);
    this.categoryService.createUpazilla(this.upazilla).subscribe( res => {
      console.log("upazilla----------",res);
    }),
    error => {
      console.log(error);
    };
  }

}
