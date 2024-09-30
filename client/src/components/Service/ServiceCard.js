import React from 'react';
import PropTypes from 'prop-types';

function ServiceCard({ serviceName, serviceDescription, serviceStartingTime, serviceEndingTime, serviceSlotTime }) {
  return (
    <div className="service-card">
        <h3>{serviceName}</h3>
        <p>{serviceDescription}</p>
        <p>Slot: {serviceStartingTime} - {serviceEndingTime}</p>
        <p>Slot Duration: {serviceSlotTime} minutes</p>
    </div>
  );
}

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
