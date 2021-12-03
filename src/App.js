import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
    const [currencies, setCurrencies] = useState([]);
    const [currName, setCurrNames] = useState([]);
    const [rate, setRate] = useState(1);
    const [firstCurrName, setFirstCurrName] = useState("Euro");
    const [secondCurrName, setSecondCurrName] = useState("Euro");
    const [firstCurr, setFirstCurr] = useState("EUR");
    const [secondCurr, setSecondCurr] = useState("EUR");
    const [amount, setAmount] = useState(1);
    const [secondAmount, setSecondAmount] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const date = new Date();
    let today;

    //this is needed because the API takes dates in YYYY-MM-DD and the first
    // 9 days of the month in ReactJS Date return as a single digit
    if(date.getDate() < 10) {
        today = `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`
    } else {
        today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }

    useEffect(() => {
        fetchSymbols();
    }, [])

    useEffect(() => {
        convert()
    }, [secondCurr, firstCurr, amount])

    function fetchSymbols() {
        fetch("http://api.exchangeratesapi.io/v1/symbols?access_key=" + process.env.REACT_APP_EXCHANGE_RATE_API_KEY)
            .then(res => res.json())
            .then((result) => {
                    setIsLoaded(result.success);
                    setCurrencies(Object.keys(result.symbols));
                    setCurrNames(result.symbols)
            })
            .catch((error) => {
                setIsLoaded(true);
                setError(error);
                console.clear();
            })
    }

    //converts using the ExchangeRatesAPI to get the rate and set the amount requested.
    function convert() {
        fetch('http://api.exchangeratesapi.io/v1/' + today + '?access_key=' + process.env.REACT_APP_EXCHANGE_RATE_API_KEY + '&base=' + firstCurr + '&symbols=' + secondCurr)
            .then(res => res.json())
            .then((result) => {
                Object.values(result.rates).forEach(val => {
                    setSecondAmount(val * amount)
                    setRate(val)
                })
                console.log(result);
            })
            .catch((error) => {
                setIsLoaded(true);
                setError(error);
                console.clear();
            })

        setSecondCurrName(currName[secondCurr])
        setFirstCurrName(currName[firstCurr])
    }

    if (error) {
        return (<div>Error: {error.message}</div>)
    } else if (!isLoaded) {
        return (<div>Loading...</div>)
    } else {
        return (
            <div className="App">
                <body>
                    <p>Please enter currencies below</p>
                    <p>1 {firstCurrName} equals {rate} {secondCurrName}</p>
                    <div className="firstDropdown">
                        <input className="input" type="number" value={amount} onChange={event => setAmount(event.target.value)}/>
                        <select
                            className="dropdown"
                            name="convertFrom"
                            value={firstCurr}
                            onChange={event => setFirstCurr(event.target.value)}
                        >
                            <option key={"EUR"} value={"EUR"}>EUR</option>
                            {/*
                            if the API ever allows the free version to use all currencies, this will be useful in the future
                            {currencies.map((currency) => {
                                return (<option key={currency} value={currency}>{currency}</option>)
                            })}
                            */}
                        </select>
                    </div>

                    <div className="secondDropdown">
                        <input className="input" type="number" value={secondAmount} onChange={event => setSecondAmount(event.target.value)} />
                        <select
                            className="dropdown"
                            name="convertTo"
                            value={secondCurr}
                            onChange={event => setSecondCurr(event.target.value)}
                        >
                            {currencies.map((currency) => {
                                return (<option key={currency} value={currency}>{currency}</option>)
                            })}
                        </select>
                    </div>


                    {/*<button type="button" onClick={convert}>
                        Convert!
                    </button>*/}
                </body>
            </div>
        );
    }
}

export default App;
