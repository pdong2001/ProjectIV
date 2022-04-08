export interface PagedAndSortedRequest {
    page?:number;
    limit?:number;
    column?:string;
    sort?: SortMode|string;
    search?: string;
}

export enum SortMode {
    ACS = 'asc',
    DESC = 'desc'
}