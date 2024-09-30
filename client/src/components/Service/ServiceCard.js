import React from 'react';
import PropTypes from 'prop-types';

function ServiceCard({ serviceName, serviceDescription, serviceStartingTime, serviceEndingTime, serviceSlotTime }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <h3>{serviceName}</h3>
      <p>{serviceDescription}</p>
      <p>Starting Time: {serviceStartingTime}</p>
      <p>Ending Time: {serviceEndingTime}</p>
      <p>Slot Time: {serviceSlotTime} hrs</p>
    </div>
  );
};

ServiceCard.defaultProps = {
  serviceName: "Service Name",
  serviceDescription: "Service description",
  serviceStartingTime: "0:0",
  serviceEndingTime: "0:0",
  serviceSlotTime: 1,
};

ServiceCard.propTypes = {
  serviceName: PropTypes.string,
  serviceDescription: PropTypes.string,
  serviceStartingTime: PropTypes.string,
  serviceEndingTime: PropTypes.string,
  serviceSlotTime: PropTypes.number
};

export default ServiceCard;
