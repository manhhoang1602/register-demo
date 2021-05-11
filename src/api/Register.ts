import {IApiRes, postRequest} from "../commons/services/BaseService";

export interface IResUser {
    id?: number
    name: string
    avatar?: string
    mail: string
    address: string
    phoneNumber: string
    password: string,
    createAt: string
}

export function sendRegister(data: IResUser, url: string):Promise<IApiRes<IResUser>> {
    return postRequest(data, url);
}