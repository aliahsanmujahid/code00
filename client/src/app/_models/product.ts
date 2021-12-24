export interface IProduct {
    id: number;
    cateId: number;
    subcateId: number;
    subsubcateId: number;
    name: string;
    description: string;
    highLights: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    youtubeLink: string;
    price: number;
    discPrice: number;
    disCount: number;
    bundel: boolean;
    quantity: number;
    colors : IColors[];
    sizes : ISizes[]
}

export interface IColors {
    name: string;
    colorCode:string;
    quantity: number;
}
export interface ISizes {
    name: string;
    quantity: number;
}

export interface Product {
    id: number;
    name: string;
    appUserId:number;
    description: string;
    highLights: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    youtubeLink: string;
    price: number;
    discPrice: number;
    disCount: number;
    bundel: boolean;
    quantity: number;
    colors : Colors[];
    sizes : Sizes[]
}

export interface Colors {
    id: number,
    name: string;
    colorCode:string;
    price: number;
    quantity: number;
}
export interface Sizes {
    id: number,
    name: string;
    price: number;
    quantity: number;
}
