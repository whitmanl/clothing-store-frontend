export interface FormData {
  username: string;
  password: string;
  email?: string;
}

export interface FormError {
  username?: string;
  password?: string;
  email?: string;
}
