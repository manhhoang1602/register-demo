import * as React from 'react';
import './index.scss';
import {useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {commonValidate, validateMail} from "./Service";
import BaseService from "../../commons/services/BaseService";
import {IResUser, sendRegister} from "../../api/Register";

interface IUser extends IResUser {}

const Register: React.FC<{ history: any }> = ({history}) => {

    const [name, setName] = useState<string | null>(null);
    const [mail, setMail] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [pass, setPass] = useState<string | null>(null);
    const [repeatPass, setRepeatPass] = useState<string | null>(null);
    const [captcha, setCaptcha] = useState<string | null>(null);
    const [checkPass, setCheckPass] = useState<boolean>(true);

    const styleValidate = (check: boolean | null, type: 'text' | 'icon'): React.CSSProperties => {
        if (check) return {}; else if (type === 'text') return {visibility: 'visible'}; else return {color: 'red'};
    }

    const validateAll = (): boolean => {
        if (
            commonValidate(name, /^[a-zA-z\s]{6,25}$/) &&
            validateMail(mail) &&
            commonValidate(address, /^[a-zA-z\d\s]{6,50}$/) &&
            commonValidate(phoneNumber, /^[\d]{10,10}$/) &&
            commonValidate(pass, /^[\w\W]{6,}$/) &&
            (pass === repeatPass) && captcha
        ) {
            return true
        }
        return false
    }

    const onRegister = async () => {
        if (validateAll()) {
            BaseService.setStatusLoading(true);
            let data: IUser = {
                name: name || '',
                address: address || '',
                mail: mail || '',
                phoneNumber: phoneNumber || '',
                password: repeatPass || ''
            }
            let res = await sendRegister(data, 'https://60964612116f3f00174b2db6.mockapi.io/user');
            if (res.status === 201) {
                BaseService.setStatusLoading(false);
                BaseService.pushNotify('success', 'Register successful !!!')
                history.push('/home/list-user');
            } else {
                BaseService.pushNotify('error', 'Opp !!! Register error !!!')
            }
        } else {
            BaseService.pushNotify('error', 'Please check again form register');
        }
    }


    const formRegisterLeft = () => {

        const showPass = (type: boolean) => {
            return (
                <div>
                    {type ? <i className="far fa-eye" onClick={() => setCheckPass(!checkPass)}/> :
                        <i className="far fa-eye-slash" onClick={() => setCheckPass(!checkPass)}/>}
                </div>
            )
        }

        return (
            <div className={'form-register-left'}>
                <div className={'form-title'}>Sign up</div>
                <div className={'wrapper-input'}>

                    <div>
                        <div className={'wrapper-item'}>
                            <i className="fas fa-user" style={styleValidate((commonValidate(name, /^[a-zA-z\s]{6,25}$/) || name === null), 'icon')}/>
                            <input type="text" placeholder={'Your Name'} onChange={(event) => setName(event.target.value)}/>
                        </div>
                        <small style={styleValidate((commonValidate(name, /^[a-zA-z\s]{6,25}$/) || name === null), 'text')}>
                            Your name must has 6-50 characters
                        </small>
                    </div>

                    <div>
                        <div className={'wrapper-item'}>
                            <i className="fas fa-envelope" style={(validateMail(mail) || mail === null) ? {} : {color: 'red'}}/>
                            <input type="text" placeholder={'Your Email'} onChange={(event) => setMail(event.target.value)}/>
                        </div>
                        <small style={(validateMail(mail) || mail === null) ? {} : {visibility: 'visible'}}>
                            illegal
                        </small>
                    </div>

                    <div>
                        <div className={'wrapper-item'}>
                            <i className="fas fa-map-marker-alt"
                               style={styleValidate(commonValidate(address, /^[a-zA-z\d\s]{6,50}$/) || address === null, 'icon')}/>
                            <input type="text" placeholder={'Your Address'} onChange={(event) => setAddress(event.target.value)}/>
                        </div>
                        <small style={styleValidate(commonValidate(address, /^[a-zA-z\d\s]{6,50}$/) || address === null, 'text')}>
                            Your name must has 6-50 characters
                        </small>
                    </div>

                    <div>
                        <div className={'wrapper-item'}>
                            <i className="fas fa-mobile-alt"
                               style={styleValidate(commonValidate(phoneNumber, /^[\d]{10,10}$/) || phoneNumber === null, 'icon')}/>
                            <input type="text" placeholder={'Phone Number'} onChange={(event) => setPhoneNumber(event.target.value)}/>
                        </div>
                        <small style={styleValidate(commonValidate(phoneNumber, /^[\d]{10,10}$/) || phoneNumber === null, 'text')}>
                            Your name must has 6-50 characters
                        </small>
                    </div>

                    <div>
                        <div className={'wrapper-item'}>
                            <i className="fas fa-lock" style={styleValidate(commonValidate(pass, /^[\w\W]{6,}$/) || pass === null, 'icon')}/>
                            {showPass(checkPass)}
                            <input type={checkPass ? 'password' : 'text'} placeholder={'Password'} onChange={(event) => setPass(event.target.value)}/>
                        </div>
                        <small style={styleValidate(commonValidate(pass, /^[\w\W]{6,}$/) || pass === null, 'text')}>
                            Your name must has 6-50 characters
                        </small>
                    </div>

                    <div>
                        <div className={'wrapper-item'}>
                            <i className="fas fa-unlock" style={styleValidate(((pass === repeatPass) || (repeatPass === null)), 'icon')}/>
                            <input type='password' placeholder={'Repeat your password'} onChange={(event) => setRepeatPass(event.target.value)}/>
                        </div>
                        <small style={styleValidate(((pass === repeatPass) || (repeatPass === null)), 'text')}>
                            Your name must has 6-50 characters
                        </small>
                    </div>

                    <div style={{marginTop: 15}}>
                        <ReCAPTCHA sitekey="6Ldb6foUAAAAANXRBMbMqlZowbdhvcg1NBJGx7OG" onChange={(data) => {
                            setCaptcha(data);
                        }}/>
                    </div>
                    <button style={validateAll() ? {} : {cursor: 'not-allowed'}} disabled={!validateAll()} onClick={() => onRegister()}>Register</button>
                </div>
            </div>
        )
    }

    const formRegisterRight = () => {
        return (
            <div className={'form-register-right'}>
                <div className={'wrapper-img'} onClick={() => {
                    fetch('https://fakestoreapi.com/users?page=1&limit=10')
                        .then(res=>res.json())
                        .then(json=>console.log(json))
                }
                }>
                    <img src='https://colorlib.com/etc/regform/colorlib-regform-7/images/signup-image.jpg' alt='img'/>
                </div>
                <div className={'login-now'} style={{display: "flex", alignItems: "center"}} onClick={() => history.push('/login')}>
                    <span style={{marginRight: 5}}>Login now</span>
                    <i className="fas fa-long-arrow-alt-right"/>
                </div>
            </div>
        )
    }
    return (
        <div className={'register'}>
            <div className={'wrapper-form'}>
                {formRegisterLeft()}
                {formRegisterRight()}
            </div>
        </div>
    )
}

export default Register;