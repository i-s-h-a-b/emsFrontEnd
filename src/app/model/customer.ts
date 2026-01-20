
export interface Customer {
  userId: number;
  customerID: number;
  username: string;
  email: string;
  fname: string;
  lname: string;
  consumerId: string[];
  address: string;
  mobileNumber: string;
  customerType: 'RESIDENTIAL'|'COMMERCIAL';
  electricalSection :'OFFICE'|'REGION'
}
