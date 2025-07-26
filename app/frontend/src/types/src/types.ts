import { AxiosResponse } from "axios";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  rating_rate: string;
  rating_count: number;
  stock_quant: number;
  price: number;
}

export interface ProductGetRequest {
  count: number;
  next: string | undefined;
  previous: string | undefined;
  results: Product[];
}

export interface TokenPostRequest {
  access: string;
  refresh: string;
}

export interface User {
  cpf: string;
  email: string;
  full_name: string;
  address: string;
}

export interface GenericPostRequest<T> extends AxiosResponse {
  data: T;
}

export interface Cart {
  id: number;
  user: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  price: string;
  cart: number;
  product: Product;
}
export interface UserCartGetRequest {
  cart: Cart;
  items: CartItem[];
}

export interface Order {
  id: number;
  date_ordered: string;
  total_price: string;
  status: string;
  user: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  order: number;
}

export interface OrderWithOrderItems {
    order: Order
    items: OrderItem[]
}
