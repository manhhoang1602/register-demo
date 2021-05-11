import * as React from 'react';
import {Button, TextField, Form, FormLayout} from '@shopify/polaris';
import {useCallback, useState} from "react";
import {commonValidate, formatPhoneNumber} from "../Service";
import BaseService, {putRequest} from "../../../commons/services/BaseService";

const FormEdit: React.FC<{ data: { id: number, name: string, address: string, phoneNum: string }, onEditSuc?: () => any }> = ({data, onEditSuc}) => {

    const [name, setName] = useState<string>(data.name);
    const [address, setAddress] = useState<string>(data.address);
    const [phoneNumber, setPhoneNumber] = useState<string>(data.phoneNum);
    const [statusFir, setStatusFir] = useState<boolean>(false);

    const [statusValName, setStatusValName] = useState<boolean>(false);
    const [statusValAddress, setStatusValAddress] = useState<boolean>(false);
    const [statusValPhone, setStatusValPhone] = useState<boolean>(false);

    const handleNameChange = useCallback((value) => setName(value), []);
    const handleAddressChange = useCallback((value) => setAddress(value), []);
    const handlePhoneChange = useCallback((value) => setPhoneNumber(formatPhoneNumber(value)), []);

    const validateAll = () => {
        setStatusFir(true)
        if (commonValidate(name, /^[a-zA-z\s]{6,25}$/)) setStatusValName(true); else setStatusValName(false)
        if (commonValidate(address, /^[a-zA-z\d\s]{6,50}$/)) setStatusValAddress(true); else setStatusValAddress(false)
        if (commonValidate(phoneNumber, /^[\d-]{12,12}$/)) setStatusValPhone(true); else setStatusValPhone(false)
    }

    const onEdit = async () => {
        await validateAll()
        if (commonValidate(name, /^[a-zA-z\s]{6,25}$/) && commonValidate(address, /^[a-zA-z\d\s]{6,50}$/) && commonValidate(phoneNumber, /^[\d-]{12,12}$/)) {
            BaseService.setStatusLoading(true);
            let url: string = `https://60964612116f3f00174b2db6.mockapi.io/user/${data.id}`;
            let resEdit = await putRequest({name: name, address: address, phoneNumber: phoneNumber}, url);
            if (resEdit.status === 200) {
                BaseService.setStatusLoading(false);
                onEditSuc && onEditSuc();
                BaseService.pushNotify('success', 'Edit successful');
            }
        }
    }

    const showInputErr = (status: boolean, fir: boolean) => {
        if (!fir) {
            return false;
        } else {
            if (status) return false; else return true;
        }
    }


    return (
        <Form onSubmit={onEdit}>
            <FormLayout>

                <TextField value={name} onChange={handleNameChange} label="Your name" type="text"
                           minLength={6} maxLength={25} error={showInputErr(statusValName, statusFir)}
                           helpText={<span>6 - 25 characters</span>}
                />

                <TextField value={address} onChange={handleAddressChange} label="Your address" type="text"
                           minLength={6} maxLength={50} error={showInputErr(statusValAddress, statusFir)}
                           helpText={<span>Fill your address.</span>}
                />

                <TextField value={phoneNumber} onChange={handlePhoneChange} label="Your phone number" type="text"
                           minLength={12} maxLength={12} error={showInputErr(statusValPhone, statusFir)}
                           helpText={<span>9-digit number.</span>}
                />

                <Button submit>Edit</Button>
            </FormLayout>
        </Form>
    )
}

export default FormEdit;