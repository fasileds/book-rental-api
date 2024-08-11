export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  isChecked: boolean;
  isAdmin: boolean;
}
