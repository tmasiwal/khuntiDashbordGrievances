import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

const PieChartHighlight = ({ modalOpen }) => {
  const [grievance, setgrievance] = useState([]);
  const [chartHeight, setChartHeight] = useState(window.innerWidth * 0.2);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

 
  const [data, setData] = useState([
    ["Status", "Count"],
    ["Pending", 0],
    ["Completed", 0],
    ["Reject", 0],
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (loginuser === "admin") {
          res = await axios.get(
            `https://grievanceskhuntibacked.onrender.com/grievances/grievance-count`
          );
        } else {
          res = await axios.get(
            `https://grievanceskhuntibacked.onrender.com/grievances/grievance-count?block=${loginuser}`
          );
        }

        setgrievance(res.data);

        const newData = [...data];
        res.data.forEach((el) => {
          if (el.state === 1) {
            newData[1][1] = el.count;
          } else if (el.state === 2) {
            newData[2][1] = el.count;
          } else if (el.state === 3) {
            newData[3][1] = el.count;
          }
        });

        setData(newData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const handleResize = () => {
      setChartHeight(window.innerWidth * 0.2); // Adjust the height factor as needed
    };
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalOpen]);

  const options = {
    legend: "none",
    pieSliceText: "label",
    title: "Grievance Status",
    pieStartAngle: 100,
  };

  return (
    <div style={{ width: "100%",  }}>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={`${chartHeight}px`}
      />
    </div>
  );
};

export default PieChartHighlight;
