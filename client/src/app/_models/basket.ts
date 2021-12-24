import {v4 as uuidv4} from 'uuid';
import { Colors, Sizes } from './product';

export interface IBasket {
    shopId:Number;
    items: IBasketItem[];
}

export interface IBasketItem {
    eachid: string,
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    color : Colors[];
    size : Sizes[]
}

export class Basket implements IBasket {
    shopId:Number;
    items: IBasketItem[] = [];
}

export interface IBasketTotals {
    delevary: number;
    subtotal: number;
    total: number;
} 