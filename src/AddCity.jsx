import { useState } from "react"
import '../styles/style.css';

export default function AddCity({onAddCity}){

const [value, setValue] = useState('')



const handlesubmit = (e) => {
    e.preventDefault()
    onAddCity(value)
    if(!value.trim()) return;
    setValue('')
}


    return(
        <> 
        <form onSubmit={handlesubmit} style={{display: 'flex', flexDirection: 'row'}}>
             <input
            id="cityNameInput"
            type="text"
            placeholder="Add new city"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" id="addCity">
            <img id="glass" src="images/glass.png" alt="Search" />
          </button>
        </form>
        </>
       
    )
}