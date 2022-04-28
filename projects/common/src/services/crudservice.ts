import { Observable } from "rxjs";
import { Response } from "../Contracts/Common/response";
import { HttpService } from "./http.service";

export abstract class CRUDService<TDto, TInsertUpdate, TLookUp>{

    protected controller:string='';
    constructor(protected httpClient:HttpService){}

    public create(input:TInsertUpdate):Observable<Response<number>>
    {
        const url = this.controller;
        return this.httpClient.post<Response<number>>(url, input);
    }
    public getList(request:TLookUp):Observable<Response<TDto[]>>
    {
        const url = this.controller;
        return this.httpClient.get<Response<TDto[]>>(url, {params : request});
    }
    public get(id:any):Observable<Response<TDto>>
    {
        const url = `${this.controller}/${id}`;
        return this.httpClient.get<Response<TDto>>(url);
    }
    public update(id:any, input:TInsertUpdate):Observable<Response<number>>
    {
        const url = `${this.controller}/${id}`;
        return this.httpClient.put<Response<number>>(url, input);
    }
    public delete(id:any):Observable<Response<number>>
    {
        const url = `${this.controller}/${id}`;
        return this.httpClient.delete<Response<number>>(url);
    }
}
