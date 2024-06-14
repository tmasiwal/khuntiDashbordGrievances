import { useState } from "react";

import './App.css'
import Navbars from './Components/Navbars/Navbars'
import PieChartHiglight from "./Components/Charts/PieChart/PieChart";
import BarChartBlock from './Components/Charts/BarChart/BarChartBlock';
import Allrout from './Allrout';

function App() {
  const [count, setCount] = useState(0)
  

  return (
    <>
      <Navbars />
      <Allrout/>
      
    </>
  );
}

export default App
