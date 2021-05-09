import React, {Component} from 'react';
import './App.scss';
import Router from "./modules/router/Router";
import Notify from "./commons/notify/Notify";
import {observer} from 'mobx-react';
import store from './commons/services/BaseService';
import {Frame, Loading} from '@shopify/polaris';

@observer
class App extends Component {

    constructor(props: any) {
        super(props);
        try {
            if (window.location.pathname === '/')
                window.location.href = '/register';
        } catch (e) {
            console.error(e);
        }
    }

    private loading = (status: boolean) => {
        if (status) return(
            <div style={{height: '100px', position: 'absolute', top: 0}}>
                <Frame>
                    <Loading />
                </Frame>
            </div>
        )
    }

    render() {
        return (
            <div style={{position: 'relative', zIndex: 1, overflowX: 'hidden'}}>
                <div
                    className={store.statusPushMes? 'animation-push-mes' : ''}
                    style={{
                        position: 'absolute',
                        top: '5%',
                        right: `-100%`,
                        zIndex: 1000,
                    }}
                >
                    {Notify(store.type, store.mes)}
                </div>
                {this.loading(store.statusLoading)}
                <Router/>
            </div>
        );
    }
}

export default App;
