import React, { useContext, useEffect, useState, useCallback } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import debounce from "lodash.debounce";
import { MyContext } from "../../../main";

const BarChartBlock = ({ modalOpen }) => {
  const [data, setData] = useState([]);
  const [chartHeight, setChartHeight] = useState(window.innerWidth * 0.18);

  const { ranges } = useContext(MyContext);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  const xAxisData =
    loginuser === "admin"
      ? ["Arki", "Khunti", "Murhu", "Rania", "Torpa", "Karra"]
      : [loginuser];

  const initializeChartData = useCallback(() => {
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
  }, [data, xAxisData]);

  useEffect(() => {
    const fetchData = async () => {
      setData([]);
      try {
        const response = await axios.get(
          `https://grievanceskhuntibacked.onrender.com/grievances/block-and-date`,
          {
            params:
              loginuser === "admin"
                ? { range: ranges.selectedRange }
                : { block: loginuser, range: ranges.selectedRange },
          }
        );
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    const handleResize = debounce(() => {
      if (window.innerWidth < 768) {
        setChartHeight(200); // Fixed height for mobile view
      } else {
        setChartHeight(window.innerWidth * 0.18); // Adjusted height for larger screens
      }
    }, 100);

    handleResize(); // Call once to set the initial height
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalOpen, ranges, loginuser]);

  return (
    <div style={{ position: "relative", padding: "0px 10px 0px 10px" }}>
      <Chart
        width={"100%"}
        height={chartHeight}
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={initializeChartData()}
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
