import React, {useEffect, useState} from "react";
import RangeInput from "./RangeInput";
import CargoInput from "./CargoInput";
import CommodityInput from "./CommodityInput";
import LocationInput from "./LocationInput";
import StepInput from "./StepInput";
import {Form} from "react-bootstrap";
import CommodityLocationInput from "./CommodityLocationInput";
import "bootstrap/dist/css/bootstrap.css";
import Notification from "./Notification";
import FilterInput from "./FilterInput";


const commodity_url = "/commodities?"
const location_url = "/locations?"


function InputSection({onSubmit, lockForm, highLevelPlan, formError, setFormError}) {
    const [range, setRange] = useState(2);
    const [step, setStep] = useState(2);
    const [cargo, setCargo] = useState(696);
    const [commodities, setCommodities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [comOptions, setComOptions] = useState([])
    const [locOptions, setLocOptions] = useState([])
    const [restrictions, setRestrictions] = useState([])
    const [fileLocation, setFileLocation] = useState(null)
    const [filter, setFilter] = useState(".*")

    useEffect(() => {
        // fetch data
        const dataFetch = async (url) => {
            return await (
                await fetch(
                    url + new URLSearchParams({
                        filter: filter
                    })
                )
            ).json()
        };

        dataFetch(commodity_url).then(d => setComOptions(d))
        dataFetch(location_url).then(d => setLocOptions(d))
    }, [filter]);

    const handleRangeChange = (value) => {
        setRange(value);
    };

    const handleStepChange = (value) => {
        setStep(value);
    };

    const handleCargoChange = (value) => {
        setCargo(value);
    };

    const handleCommodityChange = (index, name, value) => {
        const newCommodities = [...commodities];
        newCommodities[index].amount = value;
        newCommodities[index].name = name;
        setCommodities(newCommodities);
    };

    const handleCommodityRemove = (index) => {
        const newCommodities = [...commodities];
        newCommodities.splice(index, 1);
        setCommodities(newCommodities);
    };

    const handleLocationChange = (index, name) => {
        const newLocations = [...locations];
        newLocations[index] = name;
        setLocations(newLocations);
    };

    const handleLocationRemove = (index) => {
        const newLocations = [...locations];
        newLocations.splice(index, 1);
        setLocations(newLocations);
    };

    const handleAddLocation = () => {
        const newLocations = [...locations, ""];
        setLocations(newLocations);
    }

    const handleAddCommodity = () => {
        const newCommodities = [...commodities, {name: "", amount: 100}];
        setCommodities(newCommodities);
    };

    const handleComLocChange = (index, com, loc, val) => {
        const newRestrictions = [...restrictions]
        newRestrictions[index].commodity = com;
        newRestrictions[index].location = loc
        newRestrictions[index].value = val
        setRestrictions(newRestrictions)
    };

    const handleAddComLoc = () => {
        const newRestrictions = [...restrictions, {commodity: "", location: "", value: 100}]
        setRestrictions(newRestrictions)
    }

    const handleRemoveComLoc = (index) => {
        const newRestrictions = [...restrictions]
        newRestrictions.splice(index, 1);
        setRestrictions(newRestrictions)
    }

    const validateForm = (form) => {
        if (!form.checkValidity()) {
            return false
        }
        for (const c of commodities) {
            if (!comOptions.includes(c.name)) {
                return false
            }
        }
        for (const l of locations) {
            if (!locOptions.includes(l)) {
                return false
            }
        }
        for (const r of restrictions) {
            if (!locOptions.includes(r.location)) {
                return false
            }
            if (!comOptions.includes(r.commodity)) {
                return false
            }
        }
        setFormError(null)
        return true
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (validateForm(form) === false) {
            event.stopPropagation();
            return
        }
        onSubmit(range, step, cargo, commodities, locations, restrictions, filter);
    };

    const addBlacklist = (newRestrictions, transactions) => {
        if (transactions) {
            for (const t of transactions) {
                newRestrictions.push({location: t.location, commodity: t.commodity, value: 0})
            }
        }
    }

    const handleBlacklist = () => {
        const newRestrictions = [...restrictions]
        if (highLevelPlan) {
            addBlacklist(newRestrictions, highLevelPlan.buyTransactions)
            addBlacklist(newRestrictions, highLevelPlan.sellTransactions)
        }
        setRestrictions(newRestrictions)
    }

    const create_settings = () => {
        const settings = {
            cargo: cargo,
            range: range,
            step: step,
            filter: filter,
            commodities: commodities,
            locations: locations,
            restrictions: restrictions
        }
        return JSON.stringify(settings)
    }

    const load_settings = (event) => {
        const reader = new FileReader()
        try {
            reader.readAsText(event.target.files[0])
            reader.addEventListener("loadend", (_) => {
                try {
                    const settings = JSON.parse(reader.result)
                    if (Object.hasOwn(settings, "cargo")) {
                        setCargo(Number(settings.cargo))
                    }
                    if (Object.hasOwn(settings, "range")) {
                        setRange(Number(settings.range))
                    }
                    if (Object.hasOwn(settings, "step")) {
                        setStep(Number(settings.step))
                    }
                    if (Object.hasOwn(settings, "filter")) {
                        setFilter(String(settings.filter))
                    }
                    if (Object.hasOwn(settings, "commodities")) {
                        const coms = []
                        for (const c of settings.commodities) {
                            coms.push({
                                name: c.name,
                                amount: Number(c.amount)
                            })
                        }
                        setCommodities(coms)
                    }
                    if (Object.hasOwn(settings, "locations")) {
                        const locs = []
                        for (const c of settings.locations) {
                            locs.push(String(c))
                        }
                        setLocations(locs)
                    }
                    if (Object.hasOwn(settings, "restrictions")) {
                        const res = []
                        for (const c of settings.restrictions) {
                            res.push({
                                commodity: String(c.commodity),
                                location: String(c.location),
                                value: Number(c.value)
                            })
                        }
                        setRestrictions(res)
                    }
                } catch (parse_error) {
                    setFormError(parse_error.message)
                }
            })
        } catch (e) {
            setFormError(e.message)
        }
        setFileLocation(event.target.value)
    }

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <div className="form-row mb-3">
                <div className="col-md-8">
                    <RangeInput value={range} onChange={handleRangeChange}/>
                </div>
                <div className="col-md-8">
                    <StepInput value={step} onChange={handleStepChange}/>
                </div>
                <div className="col-md-8">
                    <CargoInput value={Number(cargo)} onChange={handleCargoChange}/>
                </div>
                <div className="col-md-8">
                    <FilterInput value={filter} onChange={setFilter}/>
                </div>
            </div>

            {commodities.map((commodity, index) => (
                <CommodityInput
                    key={index}
                    index={index}
                    value={commodity.amount}
                    name={commodity.name}
                    options={comOptions}
                    onChange={handleCommodityChange}
                    onRemove={handleCommodityRemove}
                />
            ))}

            {locations.map((location, index) => (
                <LocationInput
                    key={index}
                    index={index}
                    value={location}
                    options={locOptions}
                    onChange={handleLocationChange}
                    onRemove={handleLocationRemove}
                />
            ))}

            {restrictions.map((restriction, index) => (
                <CommodityLocationInput
                    key={index}
                    index={index}
                    value={restriction.value}
                    commodity={restriction.commodity}
                    location={restriction.location}
                    onChange={handleComLocChange}
                    onRemove={handleRemoveComLoc}
                    com_options={comOptions}
                    loc_options={locOptions}
                />
            ))}

            <div className="form-row mb-3">
                <div className="col-md-6">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleAddCommodity}
                        >
                            Commodity
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleAddLocation}
                        >
                            Location
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleAddComLoc}
                        >
                            Tuning
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={handleBlacklist}
                            disabled={lockForm}
                        >
                            Blacklist
                        </button>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-row form-row justify-content-start mb-3">
                <div className="me-3">
                    <button type="submit" className="btn btn-primary" disabled={lockForm}>
                        Submit
                    </button>
                </div>
                <div className="me-3">
                    <a className="btn btn-secondary"
                       href={`data:text/json;charset=utf-8,${encodeURIComponent(
                           create_settings()
                       )}`}
                       download="scroute_settings.json">
                        Save Settings
                    </a>
                </div>
                <div>
                    <input
                        type="file"
                        id={"settingFileUpload"}
                        style={{display: "none"}}
                        value={fileLocation}
                        onChange={load_settings}
                    />
                    <button className="btn btn-secondary"
                            onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                document.getElementById("settingFileUpload").click()
                            }}>
                        Load Settings
                    </button>
                </div>
            </div>
            {formError &&
                <Notification onClose={() => {
                    setFormError(null)
                }} message={formError} type={"danger"}/>
            }
        </Form>

    );

}


export default InputSection;
