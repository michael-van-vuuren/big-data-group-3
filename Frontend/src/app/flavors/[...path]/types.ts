export interface Product {
    beanId: string | number;
    name: string;
    image?: string;
    roastDegree?: string;
    price?: number;
    pricePerCup?: number;
    bulkPricePerCup?: number;
    availability?: string;
    flavors?: { name: string }[];
    webpage?: string;
  }
  