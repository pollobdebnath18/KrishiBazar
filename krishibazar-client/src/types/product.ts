export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  location: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
}
