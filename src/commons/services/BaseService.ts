import {makeObservable, observable, action} from "mobx";
import axios from "axios";

class BaseService {
    type: 'info' | 'warring' | 'error' | 'success';
    mes: string;
    statusPushMes: boolean;
    statusLoading: boolean;

    constructor(type: 'info' | 'warring' | 'error' | 'success', mes: string, statusPushMes: boolean, statusLoading: boolean) {
        makeObservable(this, {
            type: observable,
            mes: observable,
            statusPushMes: observable,
            statusLoading: observable,

            pushNotify: action,
            setStatusLoading: action,
        })
        this.type = type;
        this.mes = mes;
        this.statusPushMes = statusPushMes;
        this.statusLoading = statusLoading;
    }

    pushNotify(type: 'info' | 'warring' | 'error' | 'success', mes: string) {
        this.type = type;
        this.mes = mes;
        this.statusPushMes = true;
        setTimeout(() => {
            this.statusPushMes = false;
        }, 4000);
    }

    setStatusLoading(status: boolean) {
        this.statusLoading = status;
    }
}

export interface IApiRes<T> {
    status: number
    body: T
}

export const getRequest = async (url: string): Promise<IApiRes<any>> => {
    try {
        let res = await axios({
            method: 'get',
            url: url,
        })

        if (res) {
            return {
                status: res.status,
                body: res.data
            }
        }

        return {
            status: 0,
            body: {}
        }
    } catch (e) {
        console.error(e);
        return {
            status: e.response.status,
            body: e.response.data,
        }
    }
}

export const postRequest = async (data: any, url: string): Promise<IApiRes<any>> => {
    try {
        let res = await axios({
            method: 'post',
            url: url,
            data: data
        });

        if (res) {
            return {
                status: res.status,
                body: res.data
            }
        }

        return {
            status: 0,
            body: {}
        }
    } catch (e) {
        console.error(e);
        return {
            status: e.response.status,
            body: e.response.data,
        }
    }
}

export default new BaseService('info', 'no mes', false, false);