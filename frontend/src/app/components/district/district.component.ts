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
    }else{
      this.categoryService.getdisrictsandupazilla().subscribe(res =>{
        localStorage.setItem('disupa', JSON.stringify(res));
        this.districts = res;
      });
    }
  }

  createDistrict(){
    localStorage.removeItem('disupa');
    this.categoryService.createDistrict(this.district).subscribe( res => {
      this.districts = res;
    }),
    error => {

    };
  }

  createUpazilla(){
    this.categoryService.createUpazilla(this.upazilla).subscribe( res => {
    }),
    error => {

    };
  }

}
