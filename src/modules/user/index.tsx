import * as React from 'react';
import {Card, Page} from '@shopify/polaris';
import {useEffect, useState} from "react";
import {getListUser, IResListUser} from "../../api/User";
import './index.scss';
import BaseService from "../../commons/services/BaseService";
import Map from "./Map";


const ListUser: React.FC<any> = () => {

    const [listUser, setListUser] = useState<IResListUser[]>([]);
    const [page, setPage] = useState<number>(1);
    const [location, setLocation] = useState<{lat: number, lng: number}>({lat: 21.027763, lng: 105.834160});

    const getUsers = async (page: number) => {
        try {
            BaseService.setStatusLoading(true);
            const res = await getListUser(`https://60964612116f3f00174b2db6.mockapi.io/user?page=${page}&limit=5`);
            if (res.status === 200) {
                BaseService.setStatusLoading(false)
                setListUser(res.body);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const checkMap = (lat: number, lng: number) => {
        setLocation({lat: lat, lng: lng});
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }

    const cardItem = (item: IResListUser) => {
        return (
            <div key={item.id} style={{marginBottom: 10}}>
                <Card sectioned title={item.name} actions={[{content: 'Check google map', onAction() {checkMap(item.lat, item.lng)}}]}>
                    <div style={{
                        display: "flex"
                    }}>
                        <div style={{
                            height: 75,
                            width: 75,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#0093E9',
                            backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 24
                        }}>
                            <div>{item.name[0].toUpperCase()}</div>
                        </div>
                        <div style={{marginLeft: 8}}>
                            <div style={{fontWeight: "bold", textTransform: 'capitalize'}}>{item.name}</div>
                            <div>{item.address}</div>
                            <div>{item.phoneNumber}</div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    useEffect(() => {
        getUsers(page)
    }, [page]);

    return (
        <div style={{position: 'relative'}}>
            <Page
                narrowWidth
                breadcrumbs={[{content: 'Orders', url: '/register'}]}
                title="List user"
                pagination={{
                    onPrevious() {
                        if (page > 1) setPage(page - 1)
                    },
                    hasPrevious: (page === 1) ? false : true,
                    onNext() {
                        setPage(page + 1)
                    },
                    hasNext: true,
                }}
            >
                <div className={'wrapper-google-map'} style={{position: 'fixed', top: '0%', right: '0%', zIndex: 1, height: 400, width: 400}} >
                    <Map lat={location.lat} lng={location.lng} />
                </div>
                {
                    listUser.map((value) => cardItem(value))
                }
            </Page>
        </div>
    )
}

export default ListUser;