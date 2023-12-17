import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [vehicles, setVehicles] = useState([]); // Added state for vehicles
  const [searchText, setSearchText] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // useEffect(() => {
  //   // Fetch vehicles from your backend using axios (replace with your actual API endpoint)
  //   axios.get('/api/vehicles')
  //     .then(response => setVehicles(response.data))
  //     .catch(error => console.error('Error fetching vehicles:', error));

  //   // Fetch alerts from your backend using axios (replace with your actual API endpoint)
  //   axios.get('/api/alerts')
  //     .then(response => setAlerts(response.data))
  //     .catch(error => console.error('Error fetching alerts:', error));
  // }, []);
  useEffect(() => {
    // Use the sample data directly instead of fetching from the backend
    const sampleVehicles = [
      {
        "friendly_name": "KA12A3456",
        "id": "dd70a7e5-8397-4914-bbbb-4d6bb521ec67",
      },
      {
        "friendly_name": "MH12A3456",
        "id": "cc70a7e5-8397-4914-bbbb-4d6bb521ec67",
      }
    ];
  
    const sampleAlerts = [
      {
        "id": "6049dbd2-45bc-4e34-9ea2-c82ced0279f1",
        "alert_type": "Unsafe driving",
        "vehicle_id": "cc70a7e5-8397-4914-bbbb-4d6bb521ec67",
        "driver_friendly_name": "Ramesh",
        "vehicle_friendly_name": "KA12A3456",
        "timestamp": "2023-03-01T04:25:45.424Z"
      },
      {
        "id": "5149dbd2-45bc-4e34-9ea2-c82ced0279f1",
        "alert_type": "Distracted driver",
        "vehicle_id": "dd70a7e5-8397-4914-bbbb-4d6bb521ec67",
        "driver_friendly_name": "Suresh",
        "vehicle_friendly_name": "MH12A3456",
        "timestamp": "2023-03-01T04:24:45.424Z"
      },
    ];
  
    setVehicles(sampleVehicles);
    setAlerts(sampleAlerts);
  }, []);
  

  const filterAlerts = () => {
    if (!selectedVehicle) {
      return []; // No vehicle selected, return an empty array
    }
  
    const filteredAlerts = alerts.filter(alert => {
      // Search by vehicle
      const vehicleMatch = alert.vehicle_friendly_name.toLowerCase().includes(selectedVehicle.toLowerCase());
      // Search by date range
      const dateRangeMatch = startDate && endDate
        ? moment(alert.timestamp).isBetween(startDate, endDate, null, '[]')
        : true;
  
      // Free text search
      const searchTextLower = searchText.toLowerCase();
      const textSearchMatch =
        alert.driver_friendly_name.toLowerCase().includes(searchTextLower) ||
        alert.vehicle_friendly_name.toLowerCase().includes(searchTextLower) ||
        alert.alert_type.toLowerCase().includes(searchTextLower);
  
      return textSearchMatch && vehicleMatch && dateRangeMatch;
    });
  
    return filteredAlerts;
  };
  
  

  const markAsFalseAlarm = (alertId) => {
    // Implement marking an alert as false alarm (update backend accordingly)
    console.log(`Marking alert with ID ${alertId} as false alarm`);
  };

  return (
    <div className="App">
      <h1>Driver Monitoring Alerts</h1>
      <div>
        <input
          type="text"
          placeholder="Free text search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {/* Update the vehicle search input to include a dropdown */}
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
        >
          <option value="">Select Vehicle</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.friendly_name}>
              {vehicle.friendly_name}
            </option>
          ))}
        </select>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
        />
      </div>
      <div className="alerts-container">
        {filterAlerts().map(alert => (
          <div key={alert.id} className="alert">
            <p>{alert.alert_type}</p>
            <p>{alert.driver_friendly_name}</p>
            <p>{alert.vehicle_friendly_name}</p>
            <p>{moment(alert.timestamp).utc().format('YYYY-MM-DD HH:mm:ss')}</p>
            <button onClick={() => markAsFalseAlarm(alert.id)}>Mark as False Alarm</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
