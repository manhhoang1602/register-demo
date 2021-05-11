import * as React from 'react';
import './index.scss';
import {useCallback, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {commonValidate, formatPhoneNumber, validateMail} from "./Service";
import BaseService from "../../commons/services/BaseService";
import {IResUser, sendRegister} from "../../api/Register";
import {Button, TextField, Form, FormLayout} from '@shopify/polaris';

interface IUser extends IResUser {
}

const Register: React.FC<{ history: any }> = ({history}) => {

    const [name, setName] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [repeatPass, setRepeatPass] = useState<string>('');
    const [captcha, setCaptcha] = useState<string>('');

    const [statusValName, setStatusValName] = useState<boolean>(false);
    const [statusValMail, setStatusValMail] = useState<boolean>(false);
    const [statusValAddress, setStatusValAddress] = useState<boolean>(false);
    const [statusValPhone, setStatusValPhone] = useState<boolean>(false);
    const [statusValPass, setStatusValPass] = useState<boolean>(false);
    const [statusValRepeatPass, setStatusValRepeatPass] = useState<boolean>(false);
    const [statusFir, setStatusFir] = useState<boolean>(false);

    const handleNameChange = useCallback((value) => setName(value), []);
    const handleEmailChange = useCallback((value) => setMail(value), []);
    const handleAddressChange = useCallback((value) => setAddress(value), []);
    const handlePhoneChange = useCallback((value) => setPhoneNumber(formatPhoneNumber(value)), []);
    const handlePassChange = useCallback((value) => setPass(value), []);
    const handleRepeatPassChange = useCallback((value) => setRepeatPass(value), []);
    const handleRecaptchaChange = useCallback((value) => setCaptcha(value), []);

    const validateAll = async (): Promise<boolean> => {
        await setStatusFir(true)
        if (commonValidate(name, /^[a-zA-z\s]{6,25}$/)) await setStatusValName(true); else await setStatusValName(false)
        if (validateMail(mail)) await setStatusValMail(true); else await setStatusValMail(false)
        if (commonValidate(address, /^[a-zA-z\d\s]{6,50}$/)) await setStatusValAddress(true); else await setStatusValAddress(false)
        if (commonValidate(phoneNumber, /^[\d-]{12,12}$/)) await setStatusValPhone(true); else await setStatusValPhone(false)
        if (commonValidate(pass, /^[\w\W]{6,}$/)) await setStatusValPass(true); else await setStatusValPass(false)
        if (pass === repeatPass) await setStatusValRepeatPass(true); else await setStatusValRepeatPass(false)
        return true
    }

    const showInputErr = (status: boolean, fir: boolean) => {
        if (!fir) {
            return false;
        } else {
            if (status) return false; else return true;
        }
    }

    const onRegister = async (value: any) => {
        validateAll();
        if (commonValidate(name, /^[a-zA-z\s]{6,25}$/) &&
            validateMail(mail) &&
            commonValidate(address, /^[a-zA-z\d\s]{6,50}$/) &&
            commonValidate(phoneNumber, /^[\d-]{12,12}$/) &&
            commonValidate(pass, /^[\w\W]{6,}$/) &&
            (pass === repeatPass) && captcha) {
            BaseService.setStatusLoading(true);
            let data: IUser = {
                name: name || '',
                address: address || '',
                mail: mail || '',
                phoneNumber: phoneNumber || '',
                password: repeatPass || '',
                createAt: (Date.now()).toString()
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
            BaseService.pushNotify('error', 'Please check form again')
        }
    }


    const formRegisterLeft = () => {
        return (
            <div className={'form-register-left'}>
                <div className={'form-title'}>Sign up</div>

                <Form onSubmit={onRegister}>
                    <FormLayout>

                        <TextField value={name} onChange={handleNameChange} label="Your name" type="text"
                                   minLength={6} maxLength={25} error={showInputErr(statusValName, statusFir)}
                                   helpText={<span>6 - 25 characters</span>}
                        />

                        <TextField value={mail} onChange={handleEmailChange} label="Your email" type="email"
                                   error={showInputErr(statusValMail, statusFir)}
                                   helpText={<span>Fill your email.</span>}
                        />

                        <TextField value={address} onChange={handleAddressChange} label="Your address" type="text"
                                   minLength={6} maxLength={50} error={showInputErr(statusValAddress, statusFir)}
                                   helpText={<span>Fill your address.</span>}
                        />

                        <TextField value={phoneNumber} onChange={handlePhoneChange} label="Your phone number" type="text"
                                   minLength={12} maxLength={12} error={showInputErr(statusValPhone, statusFir)}
                                   helpText={<span>9-digit number.</span>}
                        />

                        <TextField value={pass} onChange={handlePassChange} label="Your password" type="password"
                                   minLength={6} error={showInputErr(statusValPass, statusFir)}
                                   helpText={<span>than less 6 characters.</span>}
                        />

                        <TextField value={repeatPass} onChange={handleRepeatPassChange} label="Repeat password" type="password"
                                   minLength={6} error={showInputErr(statusValRepeatPass, statusFir)}
                                   helpText={<span>Confirm your password.</span>}
                        />

                        <ReCAPTCHA sitekey="6Lf_3cwaAAAAAIFbhWLizmBrGcl9jGO2W9ogXeYE" onChange={(data) => handleRecaptchaChange(data)}/>

                        <Button submit>Register</Button>
                    </FormLayout>
                </Form>
            </div>
        )
    }

    const formRegisterRight = () => {
        return (
            <div className={'form-register-right'}>
                <div className={'wrapper-img'} onClick={() => {
                    fetch('https://fakestoreapi.com/users?page=1&limit=10')
                        .then(res => res.json())
                        .then(json => console.log(json))
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