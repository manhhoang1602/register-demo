import * as React from 'react';

const Notify = (type: 'info' | 'warring' | 'error' | 'success', content: string ) => {
    const getColor = (type: 'info' | 'warring' | 'error' | 'success') => {
        if (type === 'error') return 'rgb(255, 242, 240)'; else
            if (type === 'success') return 'rgb(246, 255, 237)'; else
                if (type === 'info') return 'rgb(230, 247, 255)'; else return 'rgb(255, 251, 230)'
            }
    return (
        <div style={{
            minHeight: 80,
            minWidth: 400,
            maxWidth: 401,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            padding: 20,
            backgroundColor: getColor(type)
        }}>
            <span style={{fontWeight: 'bold', fontSize: 18, marginRight: 15}}>{type.toUpperCase()}:</span>
             {content}
        </div>
    )
}

export default Notify