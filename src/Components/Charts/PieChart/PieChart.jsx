
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

const PieChartHighlight = ({ modalOpen }) => {
  const [grievance, setGrievance] = useState([]);
  const [chartHeight, setChartHeight] = useState(window.innerWidth * 0.18);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  const [data, setData] = useState([
    ["Status", "Count"],
    ["Pending", 0],
    ["Completed", 0],
    ["Rejected", 0],
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

        setGrievance(res.data);

        const newData = [
          ["Status", "Count"],
          ["Pending", 0],
          ["Completed", 0],
          ["Rejected", 0],
        ];

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
      if (window.innerWidth < 768) {
        setChartHeight(200); // Fixed height for mobile view
      } else {
        setChartHeight(window.innerWidth * 0.18); // Adjusted height for larger screens
      }
    };

    handleResize(); // Call once to set the initial height
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalOpen, loginuser]);

  const options = {
    legend: "none",
    pieSliceText: "label",
    title: "Grievance Status",
    pieStartAngle: 100,
  };

  return (
    <div style={{ width: "100%" }}>
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

