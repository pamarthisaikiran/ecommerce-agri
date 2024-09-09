// src/App.js
import React from 'react';
import AppointmentForm from './components/AppointmentForm';
import DoctorDashboard from './components/DoctorDashBoard';

function App() {
  return (
    <div>
      <h1>Dental Clinic Appointment System</h1>
      <AppointmentForm />
      <DoctorDashboard />
    </div>
  );
}

export default App;