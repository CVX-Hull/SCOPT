import React from 'react';
import PropTypes from 'prop-types';

const FilterInput = ({value, onChange}) => {
    const handleInputChange = (event) => {
        onChange(event.target.value);
    };
    return (
        <div className="form-group row align-items-center">
            <label htmlFor="filterInput" className="col-sm-3 col-form-label">Location Filter:</label>
            <div className="col-sm-9 input-group">
                <input
                    type="text"
                    className="form-control"
                    id="filterInput"
                    value={value}
                    onChange={handleInputChange}
                    required={true}
                    {...(value.length === 0) ? {valid: true} : {isInvalid: true}}
                />
            </div>
        </div>
    );
};

FilterInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default FilterInput;