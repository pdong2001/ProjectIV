import { Entity } from '../Common/entity'
export interface UserDto extends Entity{
    name:string;
    email:string;
    email_verified_at?:Date;
}
