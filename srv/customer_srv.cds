using zizo.customer as customer from '../db/customer';

service CustomerService {

    entity Customer as projection on customer.Customer;
    
}