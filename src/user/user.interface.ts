export interface User {
  _id?: string;
  name: string;
  surname: string;
  password?: string;
  address: string;
  phone: string;
  activated: boolean;
}