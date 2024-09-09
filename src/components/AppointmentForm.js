import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const AppointmentForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  // Function to fetch booked slots for the selected date
  const getBookedSlots = async (date) => {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('date', '==', date));
    const snapshot = await getDocs(q);

    // Extract booked times from the appointments
    const bookedTimes = snapshot.docs.map(doc => doc.data().time);
    setBookedSlots(bookedTimes);
  };

  // Fetch booked slots whenever the date changes
  useEffect(() => {
    if (date) {
      getBookedSlots(date);
    }
  }, [date]);

  // Function to check if a slot is booked
  const isSlotBooked = (time) => {
    return bookedSlots.includes(time);
  };

  // Function to book an appointment
  const bookAppointment = async (e) => {
    e.preventDefault();

    if (isSlotBooked(time)) {
      alert('This time slot is already booked. Please choose another time.');
      return;
    }

    // Proceed to book if available
    const appointmentsRef = collection(db, 'appointments');
    await addDoc(appointmentsRef, {
      date: date,
      time: time,
      patient: patientInfo,
    });
    alert('Appointment booked successfully!');
  };

  // Define possible time slots
  const availableSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <form onSubmit={bookAppointment}>
      <div>
        <label>Date: </label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Time: </label>
        <select value={time} onChange={(e) => setTime(e.target.value)} required>
          <option value="">Select a time</option>
          {availableSlots.map((slot) => (
            <option key={slot} value={slot} disabled={isSlotBooked(slot)}>
              {slot} {isSlotBooked(slot) ? '(Booked)' : ''}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Patient Info: </label>
        <input 
          type="text" 
          value={patientInfo} 
          onChange={(e) => setPatientInfo(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;
