import React, { useState, useEffect } from 'react';

const AllDisplay = () => {
  // State to store the fetched data
  const [data, setData] = useState([]);
  const [filterBy, setFilterBy] = useState(''); // State to track the selected filter

  // Fetch the data when the component mounts
  useEffect(() => {
    fetch('http://13.60.90.90:8000/api/all_details/')
      .then(response => response.json()) // Parse JSON response
      .then(fetchedData => setData(fetchedData)) // Set the fetched data into state
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty array to run the effect once when the component mounts

  // Function to download data as a CSV
  const downloadCSV = () => {
    const headers = [
      'Sr. No.',
      'Sender Name',
      'Sender Phone',
      'Sender Address',
      'Receiver Name',
      'Receiver Phone',
      'Receiver Address',
      'UPS Cost',
      'USPS Cost',
      'Label URL',
      'Optimal'
    ];

    const rows = data.map((item, index) => {
      const optimal =
        filterBy === 'Days'
          ? item.ups_days < item.usps_days
            ? 'UPS'
            : 'USPS'
          : item.ups_cost < item.usps_cost
          ? 'UPS'
          : 'USPS';
      return [
        index + 1,
        item.sender.name,
        item.sender.phone,
        `${item.sender.addr}, ${item.sender.city}, ${item.sender.state}, ${item.sender.zip}`,
        item.receiver.name,
        item.receiver.phone,
        `${item.receiver.addr}, ${item.receiver.city}, ${item.receiver.state}, ${item.receiver.zip}`,
        item.ups_cost,
        item.usps_cost,
        `http://13.60.90.90:8000/${item.label_url}`,
        optimal
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shipping_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to handle filter change
  const handleFilterChange = e => {
    setFilterBy(e.target.value);
  };

  return (
    <div className="Display">
      <h2>Display All</h2>
      <div className="filter">
        <select name="filter" onChange={handleFilterChange}>
          <option value="">Select Optimal Filter</option>
          <option value="Cost">Cost</option>
          <option value="Days">Days</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Sender Name</th>
            <th>Sender Phone</th>
            <th>Sender Address</th>
            <th>Receiver Name</th>
            <th>Receiver Phone</th>
            <th>Receiver Address</th>
            <th>UPS Cost</th>
            <th>USPS Cost</th>
            <th>UPS Days</th>
            <th>USPS Days</th>
            <th>Label URL</th>
            <th>Optimal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const optimal =
              filterBy === 'Days'
                ? item.ups_days < item.usps_days
                  ? 'UPS'
                  : 'USPS'
                : filterBy === 'Cost'
                ? item.ups_cost < item.usps_cost
                  ? 'UPS'
                  : 'USPS'
                : '-';
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.sender.name}</td>
                <td>{item.sender.phone}</td>
                <td>
                  {item.sender.addr},<br /> {item.sender.city},<br /> {item.sender.state},<br /> {item.sender.zip}
                </td>
                <td>{item.receiver.name}</td>
                <td>{item.receiver.phone}</td>
                <td>
                  {item.receiver.addr},<br /> {item.receiver.city},<br /> {item.receiver.state},<br /> {item.receiver.zip}
                </td>
                <td>{item.ups_cost}</td>
                <td>{item.usps_cost}</td>
                <td>{item.ups_days}</td>
                <td>{item.usps_days}</td>
                <td>
                  <a
                    href={`http://13.60.90.90:8000/${item.label_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </td>
                <td>{optimal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        style={{ width: '200px', marginTop: '20px' }}
        className="submitbtn"
        onClick={downloadCSV}
      >
        Download CSV
      </button>
    </div>
  );
};

export default AllDisplay;
