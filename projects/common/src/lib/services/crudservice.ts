import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ServiceResponse } from "../../Contracts/Common/response";
import { HttpService } from "./http.service";

export abstract class CRUDService<TDto, TInsertUpdate, TLookUp>{

    protected controller:string='';
    constructor(protected httpClient:HttpService){}

    public create(input:TInsertUpdate):Observable<ServiceResponse<number>>
    {
        const url = this.controller;
        return this.httpClient.post<ServiceResponse<number>>(url, input);
    }
    public getList(request:TLookUp):Observable<ServiceResponse<TDto[]>>
    {
        const url = this.controller;
        let params : HttpParams = new HttpParams();
        for (let value in request) {
            if (request[value])
            {
                params = params.append(value, request[value] as any );
            }
        }
        return this.httpClient.get<ServiceResponse<TDto[]>>(url, {params : params});
    }
    public get(id:any):Observable<ServiceResponse<TDto>>
    {
        const url = `${this.controller}/${id}`;
        return this.httpClient.get<ServiceResponse<TDto>>(url);
    }
    public update(id:any, input:TInsertUpdate):Observable<ServiceResponse<number>>
    {
        const url = `${this.controller}/${id}`;
        return this.httpClient.put<ServiceResponse<number>>(url, input);
    }
    public delete(id:any):Observable<ServiceResponse<number>>
    {
        const url = `${this.controller}/${id}`;
        return this.httpClient.delete<ServiceResponse<number>>(url);
    }
}
