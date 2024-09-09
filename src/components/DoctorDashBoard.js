import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firebase Firestore
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore functions

const DoctorDashboard = () => {
  const [date, setDate] = useState('');
  const [bookedAppointments, setBookedAppointments] = useState([]);

  // Function to fetch booked appointments for a specific date
  const getBookedAppointments = async (date) => {
    const appointmentsRef = collection(db, 'appointments'); // Get reference to the appointments collection
    const q = query(appointmentsRef, where('date', '==', date)); // Query the collection for the specific date
    const snapshot = await getDocs(q); // Fetch the results

    const appointments = snapshot.docs.map(doc => doc.data()); // Extract data from the documents
    setBookedAppointments(appointments);
  };

  // Fetch appointments when the date is changed
  useEffect(() => {
    if (date) {
      getBookedAppointments(date);
    }
  }, [date]);

  return (
    <div>
      <h2>Doctor's Dashboard</h2>
      <label>Select Date: </label>
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
      />
      <h3>Booked Appointments</h3>
      <ul>
        {bookedAppointments.map((appointment, index) => (
          <li key={index}>
            {appointment.time} - {appointment.patient}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;
