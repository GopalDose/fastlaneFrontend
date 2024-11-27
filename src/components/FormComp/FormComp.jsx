import React from 'react';
import './FormComp.css';
import Swal from 'sweetalert2';

const FormComp = ({ addrType, data, setData, setOpenForm, setIsValid }) => {
    // Handle field changes
    const handleChange = (field, value) => {
        setData((prevData) => ({ ...prevData, [field]: value }));
    };

    // Validate address fields
    const handleSubmit = async () => {
        // Check if required fields are filled
        const allFieldsFilled = Object.values(data).every((field) => field.trim() !== '');
        if (!allFieldsFilled) {
            Swal.fire({
                title: 'Warning!',
                text: 'Please fill in all fields before submitting.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const payload = {
                ...data,
                access_token: localStorage.getItem('access_token'), // Get access token from localStorage
            };

            const response = await fetch('http://13.60.90.90:8000/api/validate_address/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.response_code === '1') {
                const addressData = result.data || {};

                // Update address fields with validated data
                setData({
                    name: data.name, // Retain user-entered name
                    phone: data.phone, // Retain user-entered phone
                    addr: addressData.AddressLine?.[0] || data.addr,
                    city: addressData.PoliticalDivision2 || data.city,
                    state: addressData.PoliticalDivision1 || data.state,
                    zip: addressData.PostcodePrimaryLow || data.zip,
                });

                Swal.fire({
                    title: 'Success!',
                    text: 'Address validated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    setIsValid(true); // Mark address as valid
                    setOpenForm(false); // Close the form
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: result.message || 'Address validation failed. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error validating address:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while validating the address. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="login">
            <div className="form-container">
                {/* Close Button */}
                <button onClick={() => setOpenForm(false)} className="closebtn">
                    X
                </button>

                <div className="head">{addrType} Address</div>
                <form>
                    {/* Form Fields */}
                    <div className="form-control">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label>Address:</label>
                        <input
                            type="text"
                            value={data.addr}
                            onChange={(e) => handleChange('addr', e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label>City:</label>
                        <input
                            type="text"
                            value={data.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label>State:</label>
                        <input
                            type="text"
                            value={data.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label>Zip:</label>
                        <input
                            type="text"
                            value={data.zip}
                            onChange={(e) => handleChange('zip', e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="button" className="submitbtn" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormComp;
