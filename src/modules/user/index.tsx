import * as React from 'react';
import {Card, Page} from '@shopify/polaris';
import {useCallback, useEffect, useState} from "react";
import {getListUser, IResListUser} from "../../api/User";
import './index.scss';
import BaseService, {deleteRequest} from "../../commons/services/BaseService";
import Map from "./Map";
import {Button, TextField, Form, FormLayout, Layout, Modal, TextContainer} from '@shopify/polaris';
import FormEdit from "../register/form-edit/FormEdit";


const ListUser: React.FC<any> = () => {

    const [listUser, setListUser] = useState<IResListUser[]>([]);
    const [page, setPage] = useState<number>(1);
    const [location, setLocation] = useState<{ lat: number, lng: number }>({lat: 21.027763, lng: 105.834160});
    const [activeUser, setActiveUser] = useState<number | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');

    const handleSearchChange = useCallback((value) => setSearch(value), []);

    const [activeEditUser, setActiveEditUser] = useState(false);
    const handleOpenModalEdit = useCallback(() => setActiveEditUser(!activeEditUser), [activeEditUser]);
    const [activeDeleteUser, setActiveDeleteUser] = useState<boolean>(false);
    const handleOpenModalDelete = useCallback(() => setActiveDeleteUser(!activeDeleteUser), [activeDeleteUser]);


    const getUsers = async (page: number, search?: string) => {
        try {
            BaseService.setStatusLoading(true);
            const res = await getListUser(`https://60964612116f3f00174b2db6.mockapi.io/user?sortBy=createAt&order=desc&page=${page}&limit=5${search ? `&name=${search}` : ''}`);
            if (res.status === 200) {
                BaseService.setStatusLoading(false)
                if (res.body.length !== 0) {
                    setListUser(res.body);
                }

            }
        } catch (e) {
            console.error(e);
        }
    }

    const getMetadata = async () => {
        const resMetadata = await getListUser(`https://60964612116f3f00174b2db6.mockapi.io/user`);
        if (resMetadata.status === 200) {
            let resTotal = resMetadata.body.length;
            setTotal(resTotal);
            setTotalPage(Math.ceil(resTotal / 5));
        }
    }

    const deleteUser = async (id: number) => {
        BaseService.setStatusLoading(true);
        let url: string = `https://60964612116f3f00174b2db6.mockapi.io/user/${id}`;
        let resDelete = await deleteRequest(url);
        if (resDelete.status === 200) {
            BaseService.setStatusLoading(false);
            handleOpenModalDelete();
            BaseService.pushNotify('success', 'Delete successful!!!');
            getUsers(page);
        } else {
            BaseService.pushNotify('error', 'Have an error');
        }
    }

    const getStyleActive = (id: number, active: number): React.CSSProperties => {
        if (id === active) return {backgroundColor: "gray"}
        return {}
    }

    const checkMap = (lat: number, lng: number) => {
        setLocation({lat: lat, lng: lng});
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }

    const cardItem = (item: IResListUser) => {

        const ModelDelete = () => {
            return (
                <Modal activator={<div></div>} open={activeDeleteUser} onClose={handleOpenModalDelete} title="Are you sur delete user"
                       primaryAction={{
                           content: 'Cancel', onAction: () => {
                               handleOpenModalDelete()
                           },
                       }}
                       secondaryActions={[{
                           content: 'Delete', onAction: () => {
                               deleteUser(item.id as number);
                           },
                       },]}
                >
                    <Modal.Section>
                        <TextContainer>
                            <Card title="Online store dashboard" sectioned>
                                <div style={{display: "flex"}}>
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
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            )
        }

        const ModalEdit = () => {
            return (
                <Modal activator={<div></div>} open={activeEditUser} onClose={handleOpenModalEdit} title="Edit user">
                    <Modal.Section>
                        <TextContainer>
                            <FormEdit data={{id: item.id as number, name: item.name, phoneNum: item.phoneNumber, address: item.address}} onEditSuc={() => {
                                handleOpenModalEdit();
                                getUsers(page);
                            }} />
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            )
        }

        return (
            <div key={item.id} style={{...getStyleActive(item.id as number, activeUser as number), marginBottom: 10, padding: 1}}
                 onClick={() => setActiveUser(item.id as number)}>
                <Card sectioned title={item.name}
                      actions={[{
                          content: 'Check google map', onAction() {
                              checkMap(item.lat, item.lng)
                          }
                      },
                          {
                              content: 'Edit', onAction() {
                                  handleOpenModalEdit()
                              }
                          },
                          {
                              content: 'Delete', onAction() {
                                  handleOpenModalDelete()
                              }
                          }]}>
                    <div style={{display: "flex"}}>
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

                    <ModelDelete/>
                    <ModalEdit/>
                </Card>
            </div>
        )
    }

    useEffect(() => {
        getMetadata()
    }, [])

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
                    hasNext: (page < totalPage) ? true : false,
                }}
                additionalMetadata={<div>
                    <div>{`Total user: ${total}, page: ${page}/${totalPage}`}</div>
                    <Form onSubmit={() => {
                        getUsers(page, search)
                    }}>
                        <FormLayout>
                            <TextField
                                value={search}
                                onChange={handleSearchChange}
                                label="Search name"
                                type="text"
                            />

                            <Button submit>Search</Button>
                        </FormLayout>
                    </Form>
                </div>}
            >
                <div className={'wrapper-google-map'} style={{position: 'fixed', top: '0%', right: '0%', zIndex: 1, height: 400, width: 400}}>
                    <Map lat={location.lat} lng={location.lng}/>
                </div>
                <Layout>
                    <Layout.Section>
                        {
                            listUser.map((value) => cardItem(value))
                        }
                    </Layout.Section>
                </Layout>
            </Page>
        </div>
    )
}

export default ListUser;