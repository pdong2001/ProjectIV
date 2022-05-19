import { Entity } from '../Common/entity'
import { CustomerDto } from '../Customer/customer-dto';
export interface UserDto extends Entity{
    name:string;
    email:string;
    email_verified_at?:Date;
    customer : CustomerDto
}
