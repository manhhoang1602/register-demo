import {deleteRequest, getRequest, IApiRes, putRequest} from "../commons/services/BaseService";

export interface IResListUser {
    id?: number
    name: string
    avatar?: string
    mail: string
    address: string
    phoneNumber: string
    password: string
    lat: number,
    lng: number
}

export function getListUser(url: string): Promise<IApiRes<IResListUser []>> {
    return getRequest(url);
}

export function putUser(url: string, data: any): Promise<IApiRes<any>> {
    return putRequest(data, url);
}

export function deleteUser(url: string): Promise<IApiRes<any>> {
    return deleteRequest(url)
}
