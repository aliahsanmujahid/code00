import { ProductService } from './../_services/product.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../_models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductDetailedResolver implements Resolve<Product> {

    constructor(private productService: ProductService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Product> {
        console.log("resolver...");
    
        return this.productService.getProduct(route.paramMap.get('id'));
    }

} 