import React, {useEffect, useState} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {FaTrash} from "react-icons/fa";
import {Button} from "react-bootstrap";


function LocationInput({key, index, value, options, onChange, onRemove}) {

    const handleLocationChange = (val) => {
        if(Array.isArray(val)) {
            val = val[0]
        }
        onChange(index, val);
    };

    return (
        <div key={key} className="row mb-3 d-flex justify-content-between">
            <Typeahead
                className="location-select col-md-8"
                placeholder="Location"
                selected={value ? [value] : []}
                onChange={handleLocationChange}
                onInputChange={handleLocationChange}
                options={options}
                {...options.includes(value) ? {} : {isInvalid: true}}
                disabled={options.length === 0}
                required={true}
            />
            <div className="col-md-4 d-flex mr-2 align-items-end">
                <Button
                    onClick={() => onRemove(index)}
                    variant={"danger"}
                >
                    <FaTrash></FaTrash>
                </Button>
            </div>
        </div>
    );
}

export default LocationInput;
