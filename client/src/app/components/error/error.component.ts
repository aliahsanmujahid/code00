import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(public accountService:AccountService,public router:Router) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe( x => {
       if(x){
        this.router.navigateByUrl('');
       }
    });
  }

}
