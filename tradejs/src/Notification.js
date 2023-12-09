import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type, onClose }) => {
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {message}

      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
