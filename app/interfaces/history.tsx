export interface History {
  id: string;
  totalPrice: number;
  products: ProductRecord[];
  saleDate: Date
}

export interface ProductRecord {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
