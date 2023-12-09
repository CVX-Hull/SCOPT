import React from "react";

function RangeInput({value, onChange}) {
    const handleInputChange = (event) => {
        const newValue = Number(event.target.value);
        onChange(newValue);
    };

    return (
        <div className="form-group row align-items-center">
            <label className="col-sm-3 col-form-label">Range:</label>
            <div className="col-sm-9 d-flex align-items-center">
                <input
                    type="range"
                    className="form-control-range"
                    min={0}
                    max={10}
                    value={value}
                    onChange={handleInputChange}
                    required={true}
                />
                <span className="ml-2">{value}</span>
            </div>
        </div>
    );

}

export default RangeInput;
