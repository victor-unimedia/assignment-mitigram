export interface UserModel {
  _id: string;
  picture: string;
  name: {first: string, last: string};
  company: string;
  email: string;
  phone: string;
  groups?: string[];
  isSelected?: boolean; //this field is to control de selection in the main page
}
