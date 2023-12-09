import React from "react";

function StepInput({value, onChange}) {
    const handleInputChange = (event) => {
        const newValue = Number(event.target.value);
        onChange(newValue);
    };

    return (
        <div className="form-group row align-items-center">
            <label className="col-sm-3 col-form-label">Stops:</label>
            <div className="col-sm-9 d-flex align-items-center">
                <input
                    type="range"
                    className="form-control-range"
                    min={2}
                    max={10}
                    value={value}
                    onChange={handleInputChange}
                />
                <span className="ml-2">{value}</span>
            </div>
        </div>
    );

}

export default StepInput;