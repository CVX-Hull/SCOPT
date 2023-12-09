import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {Button} from "react-bootstrap";
import {FaTrash} from "react-icons/fa";


function CommodityLocationInput({index, location, commodity, value, com_options, loc_options, onChange, onRemove}) {

    const handleComNameChange = (newName) => {
        if (Array.isArray(newName)) {
            newName = newName[0]
        }
        onChange(index, newName, location, value);
    };

    const handleLocNameChange = (newName) => {
        if (Array.isArray(newName)) {
            newName = newName[0]
        }
        onChange(index, commodity, newName, value);
    };

    const handleValueChange = (event) => {
        const newVal = Number(event.target.value);
        onChange(index, commodity, location, newVal);
    };

    return (
        <div key={index}>
            <div className="location-commodity-loc row mb-3">
                <div className="col-md-8">
                    <Typeahead
                        name="location"
                        placeholder="Location"
                        selected={location ? [location] : []}
                        onChange={handleLocNameChange}
                        onInputChange={handleLocNameChange}
                        className="location-select"
                        {...(loc_options.includes(location) ? {valid: true} : {isInvalid: true})}
                        disabled={loc_options.length === 0}
                        required={true}
                        options={loc_options}
                    />
                </div>
            </div>
            <div className="location-commodity-com row mb-3">
                <div className="col-md-4">
                    <Typeahead
                        name="commodity"
                        placeholder="Commodity"
                        selected={commodity ? [commodity] : []}
                        onChange={handleComNameChange}
                        onInputChange={handleComNameChange}
                        className="commodity-select"
                        {...(com_options.includes(commodity) ? {valid: true} : {isInvalid: true})}
                        disabled={com_options.length === 0}
                        required={true}
                        options={com_options}
                    />
                </div>
                <div className="col-md-4">
                    <div className="input-group">
                        <input
                            type="number"
                            name="amount"
                            value={value}
                            max={100}
                            min={0}
                            onChange={handleValueChange}
                            className="form-control"
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-1 d-flex align-items-center">
                    <Button
                        onClick={() => onRemove(index)}
                        variant={"danger"}
                    >
                        <FaTrash></FaTrash>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CommodityLocationInput;