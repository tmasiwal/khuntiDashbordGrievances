import React, {useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { MyContext } from "../../../main";
const BarChartBlock = ({ modalOpen }) => {
  const [data, setData] = useState([]);
  const [chartHeight, setChartHeight] = useState(window.innerWidth * 0.2);

  const { ranges, setRanges } = useContext(MyContext);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  let xAxisData;

  if (loginuser === "admin") {
    xAxisData = ["Arki", "Khunti", "Murhu", "Rania", "Torpa", "Karra"];
  } else {
    xAxisData = [loginuser];
  }

  const initializeChartData = () => {
    const chartData = [["Blocks", "Pending", "Completed", "Rejected"]];

    xAxisData.forEach((block) => {
      const blockData = data.find((item) => item.block === block) || {};
      chartData.push([
        block,
        blockData["1"] || 0,
        blockData["2"] || 0,
        blockData["3"] || 0,
      ]);
    });

    return chartData;
  };

  const chartData = initializeChartData();

  useEffect(() => {
    setData([])
    if (loginuser === "admin") {
      axios
        .get(
          `https://grievanceskhuntibacked.onrender.com/grievances/block-and-date?range=${ranges.selectedRange}`
        )
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(
          `https://grievanceskhuntibacked.onrender.com/grievances/block-and-date?block=${loginuser}&range=${ranges.selectedRange}`
        )
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const handleResize = () => {
      setChartHeight(window.innerWidth * 0.2);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalOpen, ranges]);

 

  return (
    <div style={{ position: "relative" ,padding:"0px 10px 0px 10px" }}>
      
      <Chart
        width={"100%"}
        height={chartHeight}
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          chart: {
            title: "Total Grievances in Blocks",
          },
          legend: { position: "top" },
        }}
      />
    </div>
  );
};

export default BarChartBlock;
