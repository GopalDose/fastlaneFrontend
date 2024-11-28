import React, { useState } from 'react';
import AddressInput from '../components/AddressInput/AddressInput';
import Swal from 'sweetalert2';

const ShippingCost = () => {
  const [sender, setSender] = useState({
    name: '',
    phone: '',
    addr: '',
    city: '',
    state: '',
    zip: '',
  });

  const [receiver, setReceiver] = useState({
    name: '',
    phone: '',
    addr: '',
    city: '',
    state: '',
    zip: '',
  });

  const [csvFile, setCsvFile] = useState(null);
  const [packageType, setPackageType] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [serviceType, setServiceType] = useState('11');
  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
  };
  const handlePackageTypeChange = (e) => {
    const selectedType = e.target.value;
    setPackageType(selectedType);

    if (selectedType === 'Package') {
      Swal.fire({
        title: 'Enter Package Dimensions',
        html: `
          <input id="length" class="swal2-input" placeholder="Length (in cm)" type="number" min="0" step="0.1">
          <input id="width" class="swal2-input" placeholder="Width (in cm)" type="number" min="0" step="0.1">
          <input id="height" class="swal2-input" placeholder="Height (in cm)" type="number" min="0" step="0.1">
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        preConfirm: () => {
          const length = document.getElementById('length').value;
          const width = document.getElementById('width').value;
          const height = document.getElementById('height').value;

          if (!length || !width || !height) {
            Swal.showValidationMessage('All dimensions are required');
          }

          return { length, width, height };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setDimensions(result.value);
          Swal.fire('Dimensions Set!', `Length: ${result.value.length}, Width: ${result.value.width}, Height: ${result.value.height}`, 'success');
        } else {
          setPackageType('');
        }
      });
    } else {
      setDimensions({ length: '', width: '', height: '' });
    }
  };


  const handleCheckShipper = async () => {
    const allFieldsFilled =
      Object.values(sender).every((field) => field !== '') &&
      Object.values(receiver).every((field) => field !== '');

    if (!allFieldsFilled) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Fields',
        text: 'Please fill all fields for both sender and receiver addresses.',
      });
      return;
    }

    if (!packageType) {
      Swal.fire({
        icon: 'warning',
        title: 'Package Type Missing',
        text: 'Please select a package type.',
      });
      return;
    }
    if (packageType === 'Package' && (!dimensions.length || !dimensions.width || !dimensions.height)) {
      Swal.fire({
        icon: 'warning',
        title: 'Dimensions Missing',
        text: 'Please provide dimensions for the package.',
      });
      return;
    }

    const payload = {
      sender,
      receiver,
      access_token: localStorage.getItem('access_token'),
    };

    try {
      const response = await fetch('http://13.60.90.90:8000/api/get_shipping/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const { ups, usps, upsdays, uspsdays } = data;

        Swal.fire({
          icon: 'success',
          title: 'Shipping Cost Calculated',
          html: `
            <table style="width:100%; text-align:left; border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="border:1px solid black; padding:8px;">Service</th>
                  <th style="border:1px solid black; padding:8px;">Cost</th>
                  <th style="border:1px solid black; padding:8px;">Delivery Days</th>
                  <th style="border:1px solid black; padding:8px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border:1px solid black; padding:8px;">UPS</td>
                  <td style="border:1px solid black; padding:8px;">$${ups}</td>
                  <td style="border:1px solid black; padding:8px;">${upsdays}</td>
                  <td style="border:1px solid black; padding:8px;">
                    <button class="swal2-confirm swal2-styled" 
                            onclick="selectService('UPS', ${ups}, ${upsdays})">
                      Select
                    </button>
                  </td>
                </tr>
                <tr>
                  <td style="border:1px solid black; padding:8px;">USPS</td>
                  <td style="border:1px solid black; padding:8px;">$${usps}</td>
                  <td style="border:1px solid black; padding:8px;">${uspsdays}</td>
                  <td style="border:1px solid black; padding:8px;">
                    <button class="swal2-confirm swal2-styled" 
                            onclick="selectService('USPS', ${usps}, ${uspsdays})">
                      Select
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          `,
          showConfirmButton: false,
        });

        // Dynamically add a global function to handle service selection
        window.selectService = (service, cost, days) => {
          Swal.fire({
            icon: 'info',
            title: 'Service Selected',
            text: `You selected ${service} with a cost of $${cost} and ${days} days for delivery.`,
          });
        };
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Calculation Error',
          text: errorData.message || 'Error calculating shipping cost. Please try again.',
        });
      }
    } catch (error) {
      console.error('Failed to fetch shipping cost:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to connect to the server. Please check your network connection and try again.',
      });
    }
  };


  const handleCSVUpload = async (event) => {
    event.preventDefault();

    if (!csvFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a CSV file to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('access_token', localStorage.getItem('access_token'));

    try {
      const response = await fetch('http://13.60.90.90:8000/api/bulk_calculate/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shipping_results.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();

        Swal.fire({
          icon: 'success',
          title: 'CSV Downloaded',
          text: 'Shipping cost calculation results downloaded successfully.',
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Failed to calculate bulk shipping costs. Please try again.',
        });
      }
    } catch (error) {
      console.error('Failed to upload CSV file:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to connect to the server. Please check your network connection and try again.',
      });
    }
  };

  const downloadCSVTemplate = () => {
    const csvContent =
      `name,phone,addr,city,state,zip\n` +
      `Sender,,,,,\n` +
      `Receiver,,,,,\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shipping_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className='shipping'>
      <div className="head">Shipping</div>
      <div className="twoform">
        <AddressInput addrType="Sender" data={sender} setData={setSender} />
        <AddressInput addrType="Receiver" data={receiver} setData={setReceiver} />
      </div>
      <div className="package-select">
        <select value={packageType} onChange={handlePackageTypeChange}>
          <option value="">Select Type</option>
          <option value="Package">Package</option>
          <option value="UPS Letter">UPS Letter</option>
          <option value="Tube">Tube</option>
          <option value="UPS Express Box">UPS Express Box</option>
        </select>
      </div>
      <div className="package-select">
          <label htmlFor="serviceType">Select UPS Service Type:</label>
          <select id="serviceType" value={serviceType} onChange={handleServiceTypeChange}>
            <option value="11">Standard</option>
            <option value="01">Next Day Air</option>
            <option value="02">2nd Day Air</option>
            <option value="03">Ground</option>
            <option value="07">Express</option>
            <option value="08">Expedited</option>
            <option value="12">3 Day Select</option>
            <option value="13">Next Day Air Saver</option>
          </select>
        </div>
      <div className="btndiv">
        <button className='check-shipper' onClick={handleCheckShipper}>Check Shipper</button>
      </div>

      <div className="csv-upload">
        <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
        <div className="submit-buttons">
          <button className='submit' onClick={handleCSVUpload}>Upload CSV and Calculate</button>
          <button className='submit' onClick={downloadCSVTemplate}>Download CSV Template</button>
        </div>
      </div>
    </section>
  );
};

export default ShippingCost;
