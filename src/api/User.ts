import {getRequest, IApiRes} from "../commons/services/BaseService";

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