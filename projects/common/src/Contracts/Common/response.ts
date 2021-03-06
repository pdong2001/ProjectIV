export interface ServiceResponse<T>
{
    meta?:{
        perPage?:number,
        currentPage?:number,
        total?:number
    }|any;
    message?:string;
    code?:number;
    data?:T;
    status?:boolean;
}