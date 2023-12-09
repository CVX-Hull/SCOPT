import "bootstrap/dist/css/bootstrap.css";
import "./index.css"
import React, {useState} from "react";
import Header from "./Header";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";


const opt_endpoint = "/optimize"


function buildRequest(range, steps, cargo, restrictions, commodities, locations, filter) {
    const req = {
        max_range: range,
        max_cargo: cargo * 100,
        stops: steps,
        max_commodity: {},
        restrictions: {},
        blk_locations: locations,
        filter: filter
    }
    for (const c of commodities) {
        req.max_commodity[c.name] = c.amount * 0.01
    }
    for (const r of restrictions) {
        if (!Object.hasOwn(req.restrictions, r.commodity)) {
            req.restrictions[r.commodity] = {}
        }
        req.restrictions[r.commodity][r.location] = r.value * 0.01
    }
    return req
}


function App() {
    const [highLevelPlan, setHighLevelPlan] = useState(null);
    const [tradeRoute, setTradeRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null)

    function setResult(plan, route) {
        setHighLevelPlan(plan);
        setTradeRoute(route);
        setLoading(false)
    }

    const handleSubmit = (range, steps, cargo, commodities, locations, restrictions, filter) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(buildRequest(range, steps, cargo, restrictions, commodities, locations, filter))
        };
        setLoading(true)
        fetch(opt_endpoint, requestOptions).then(async response => {
            if (!response.ok) {
                setResult(null, null)
                const text = await response.text()
                throw Error(text)
            } else {
                return response.json()
            }
        }).then(data => setResult(data.plan, data.routes)).catch(error => {
            setFormError(error.message)
            setResult(null, null)
        })

    };

    return (<div className="container">
            <Header/>
            <div className="row">
                <div className="col-lg-6">
                    <InputSection onSubmit={handleSubmit}
                                  lockForm={loading}
                                  highLevelPlan={highLevelPlan}
                                  formError={formError}
                                  setFormError={setFormError}
                    />
                </div>
                <div className="col-lg-6 mt-4 mt-lg-2">
                    {loading && (
                        <div className="d-flex justify-content-center">
                            <p>Loading...</p>
                            <div className="my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {highLevelPlan && tradeRoute && !loading && (
                        <ResultSection highLevelPlan={highLevelPlan} tradeRoute={tradeRoute}/>)}
                </div>
            </div>
        </div>

    );
}

export default App;