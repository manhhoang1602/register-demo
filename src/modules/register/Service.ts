export const validateMail = (email: string | null): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const commonValidate = (value: string | null, re: any): boolean => {
    return re.test(String(value).toLowerCase());
}

export const formatPhoneNumber = (phoneNumber: string): string => {
    let cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
}