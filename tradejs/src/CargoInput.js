import React from 'react';
import PropTypes from 'prop-types';

const CargoInput = ({value, onChange}) => {
    const handleInputChange = (event) => {
        const newValue = Number(event.target.value);
        onChange(newValue);
    };
    return (
        <div className="form-group row align-items-center">
            <label htmlFor="cargoInput" className="col-sm-3 col-form-label">Maximum Cargo:</label>
            <div className="col-sm-9 input-group">
                <input
                    type="number"
                    className="form-control"
                    id="cargoInput"
                    min="0"
                    step="1"
                    value={value}
                    onChange={handleInputChange}
                    required={true}
                />
                <div className="input-group-append">
                    <span className="input-group-text">SCU</span>
                </div>
            </div>
        </div>
    );
};

CargoInput.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CargoInput;