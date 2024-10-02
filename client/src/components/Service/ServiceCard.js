import React from 'react';
import PropTypes from 'prop-types';

function ServiceCard({ serviceName, serviceDescription, serviceStartingTime, serviceEndingTime, serviceSlotTime, onShowQueue }) {
  return (
    <div className="service-card">
      <h3>{serviceName}</h3>
      <p>{serviceDescription}</p>
      <p>Slot: {serviceStartingTime} - {serviceEndingTime}</p>
      <p>Slot Duration: {serviceSlotTime} minutes</p>
      <button onClick={onShowQueue} className="queue-btn">Show Queue</button>
    </div>
  );
}

ServiceCard.defaultProps = {
  serviceName: "Service Name",
  serviceDescription: "Service description",
  serviceStartingTime: "0:0",
  serviceEndingTime: "0:0",
  serviceSlotTime: 1,
  onShowQueue: () => { }
};

ServiceCard.propTypes = {
  serviceName: PropTypes.string,
  serviceDescription: PropTypes.string,
  serviceStartingTime: PropTypes.string,
  serviceEndingTime: PropTypes.string,
  serviceSlotTime: PropTypes.number,
  onShowQueue: PropTypes.func
};

export default ServiceCard;
