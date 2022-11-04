import logo from './logo.svg';
import './App.css';
import Button from './Components/Button';
import { useEffect,useState, useRef } from 'react';

function App() {
  const [entries, setEntries] = useState([]);
  const data = {
    "Germany": "Berlin",
    "Azerbaijan": "Baku",
    "Poland": "Warszawa",
    "Papua New Guinea": "Port Moresby",
  }
  const refValue = useRef(Object.entries(data));
  const [state, setState] = useState({
    country:"",
    capital:"",
    duplicateCountry:"",
    duplicateCapital:"",
    clicked:[],
    wrongVal: false,
  })

  useEffect(()=>{
    // shuffleData(data);
    loadTest(data);
  },[]);

  const loadTest = (data1) => {
    const copy = Object.assign({}, data1);
    setEntries(Object.entries(copy));
    console.log('ddd',entries)
    console.log('ref', refValue.current);
  }
  const updateState = (values) => {
    console.log('here', values);
    setState((prev) => ({
        ...prev,
        ...values,
      })
    )
  }
  const filterData = (ele1, ele2) => {
    let filteredData = [];
    if(ele1){
      filteredData = refValue.current.filter(([key, _]) => (
        key.toLowerCase() === ele1.toLowerCase()
      ))
    } else{
      filteredData = refValue.current.filter(([_, value]) => (
        value.toLowerCase() === ele2.toLowerCase()
      ))
    } 
    const find = filteredData.find(d => d);
    updateState({clicked: find})
    console.log('find',find, state )

  }
  const validateData = (ele1, ele2) => {
    const selectedCap = state.capital ? state.capital : ele2;
    const selectedCoun = state.country ? state.country : ele1;
    console.log('==>',selectedCap,ele2,state.clicked[1],state.clicked[0])
    if(!state.wrongVal && state.clicked[1] && selectedCoun.toLowerCase() === state.clicked[0]?.toLowerCase() && selectedCap.toLowerCase() === state.clicked[1]?.toLowerCase()){
      console.log('here')
      const correctAns = refValue.current.filter(([key, value]) => {
        return ele1 !== key && ele2 !== value  
      })
      updateState({country:"", capital:""});
      refValue.current = correctAns;
      loadTest(Object.fromEntries(correctAns));
    } else if (state.wrongVal && ele1){
      updateState({country: ele1})
    } else if (state.wrongVal && ele2){
      updateState({capital: ele2})
    } else if(state.capital || state.country){
      updateState({worngVal: true})
    } else {
      return null;
    }

  }

  const handleClick = (ele1, ele2 ) => {
    if(ele1 && !state.country){
      updateState({country: ele1});
      filterData(ele1,null);
    }else if(ele2 && !state.capital){
      console.log('res$$$$$$$$$');
      updateState({capital: ele2});
      filterData(null,ele2)
    } else if(ele1 && state.country){
      updateState({duplicateCountry: ele1})
    } else if(ele2 && state.capital){
      updateState({duplicateCapital: ele2})
    }
    if (state.wrongVal) {
      updateState({
        country: "",
        capital: "",
        duplicateCapital: "",
        duplicateCountry: "",
      });
    }
    updateState({ wrongVal: false });
    validateData(ele1, ele2);
  }

  const shuffleData = (data) => {
    const dataObjKeys = Object.keys(data).sort(()=> Math.random()-0.5);
    const dataObjValues = Object.values(data).sort(()=>Math.random() -0.5);
    const newArr = dataObjKeys.map((ele, index)=>({[ele]: dataObjValues[index]}))
    const newEntries = Object.assign({}, ...newArr);
    setEntries(Object.entries(newEntries));
    console.log('entries', newArr, newEntries);
  }
  // console.log('testing', Object.entries(newEntries));
  const len = entries.length;
  return (
    <div className="App">
      
     {entries.length ? (
        entries.map(([ele, val], i)=> (
          <span key={i}>
            <button  style={
                state.country.toLowerCase() === ele.toLowerCase() &&
                !state.wrongVal
                  ? { backgroundColor: "#0000ff" }
                  : (state.country.toLowerCase() === ele.toLowerCase() ||
                      state.duplicateCountry.toLowerCase() ===
                        ele.toLowerCase()) &&
                    state.wrongVal
                  ? { backgroundColor: "#FF0000" }
                  : {}
              } onClick={() => handleClick(ele, null)}>{ele}</button>
            <button style={
                state.capital === val && !state.wrongVal
                  ? { backgroundColor: "#0000ff" }
                  : (state.capital.toLowerCase() === val.toLowerCase() ||
                      state.duplicateCapital.toLowerCase() ===
                        val.toLowerCase()) &&
                    state.wrongVal
                  ? { backgroundColor: "#FF0000" }
                  : {}
              } onClick={() => handleClick(null,val)}>{val}</button>
          </span>
     )))
     : ("Congratulations")}
    </div>
  );
}

export default App;
