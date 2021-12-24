export interface IOrder {
    name: string;
    phone: string;
    address: string;
    district: string;
    upazila: string;
    cashOnDelevary:string;
    bkash: string;
    bkashTransactionID: string;
    rocket: string;
    rocketTransactionID: string;
    nagad: string;
    nagadTransactionID: string;
    seller_id:number;
    orderItemDto:IOrderItem[]
}

export interface IOrderItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    color_id:number;
    color_name:string;
    size_id:number;
    size_name:string;
}