import React, { useState } from 'react'
import './AddressInput.css'
import FormComp from '../FormComp/FormComp'

const AddressInput = ({ addrType, data, setData }) => {
    const [openForm, setOpenForm] = useState(false)
    const [isValid, setIsValid] = useState(false)

    return (
        <div className="AddressInput">
            {openForm && (
                <FormComp
                    addrType={addrType}
                    data={data}
                    setData={setData}
                    setOpenForm={setOpenForm}
                    setIsValid={setIsValid}
                />
            )}
            <div className="addressType">{addrType}
            </div>
            <div className="address-display">
                <p>Name: <span>{data.name}</span></p>
                <p>Phone: <span>{data.phone}</span></p>
                <p>Address: <span>{data.addr}</span></p>
                <p>City: <span>{data.city}</span></p>
                <p>State: <span>{data.state}</span></p>
                <p>ZIP: <span>{data.zip}</span></p>
            </div>
            <div className='addrspan'>
                {isValid && "Address is valid"}
            </div>
            <button onClick={() => setOpenForm(true)} className="submitbtn">
                Set {addrType} Address
            </button>
        </div>
    )
}

export default AddressInput
