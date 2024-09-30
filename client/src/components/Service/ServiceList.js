import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';// Import the ServiceCard component

function ServiceList() {
  const [servicesDetails, setServicesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch services data from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://localhost:4000/api/v1/services/services'); // Replace with your API endpoint
        const data = await response.json();
        setServicesDetails(data.servicesDetails); // Assuming the data format has `servicesDetails` array
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch services');
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Services</h2>
      {servicesDetails.map(service => (
        <ServiceCard
          key={service._id} // Use a unique key for each card
          serviceName={service.name}
          serviceDescription={service.description}
          serviceStartingTime={service.slots[0]?.startTime || "N/A"}
          serviceEndingTime={service.slots[0]?.endTime || "N/A"}
          serviceSlotTime={service.slotDuration}
        />
      ))}
    </div>
  );
}

export default ServiceList;
