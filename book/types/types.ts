export type Author = {
  authorId: number;
  firstName: string;
  lastName: string;
};

export type Publisher = {
  publisherId: number;
  name: string;
};

export type Review = {
  reviewId: number;
  name: string;
  content: string;
  rating: number;
};

export type Product = {
  bookId: number;
  title: string;
  imageUrl?: string;
  pagesCount: number;
  category: Category;
  genres : Genre[];
  releseYear: number;
  price: number;
  description?: string;
  discountPrice?: number;
  staticImage?: string;
  rating: number;
  reviews: Review[];
  releaseDate: string;
  publisher: Publisher | Publisher[];
  authors: Author[];
  originalTitle: string;
  averageRating: number;
  language: string;
  quantity:number;
};
export type FormData = {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  country: string;
  deliveryMethod: string;
  paymentMethod: string;
  agreement: boolean;
};
export type OrderItem = {
  itemId: number;
  quantity: number;
  bookTitle: string;
};
export type User = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  orders: Order[];
  reviews: Review[];
};
export type Order = {
  orderId: number;
  status:
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "RETURNED";
  orderType: "REGISTERED_USER" | "GUEST";
  amount: string;
  createdAt: string;
  orderDate: string;
  items: OrderItem[];
};
export type Genre = {
  genreId: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};
export type PaginatedResponse = {
  books: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  availableGenres: Genre[];
  availableCategories: Category[];
  availableAuthors: Author[];
  maxAvailablePrice: number;
};

export type Filters = {
  selectedGenres: number[];
  selectedCategories: number[];
  selectedAuthors: number[];
  freeShipping: boolean;
  priceRange: [number, number];
};
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
export interface AuthResult {
  userEmail: string | null;
  userRole: string|null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface OrderAdmin {
  items: boolean;
  orderId: string;
  orderDate: string;
  itemsCount: number;
  amount: string;
  status: string;
}