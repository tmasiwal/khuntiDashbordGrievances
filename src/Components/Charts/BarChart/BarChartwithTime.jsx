import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Box } from "@mui/material";
import axios from "axios";
import { MyContext } from "../../../main";

const BarChartBlock = ({ modalOpen }) => {
  const [grievanceData, setGrievanceData] = useState([]);
  const [chartHeight, setChartHeight] = useState(window.innerWidth * 0.2);
  const [loading, setLoading] = useState(false);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  const { ranges } = useContext(MyContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let url;
      try {
        if (loginuser === "admin") {
          url = `https://grievanceskhuntibacked.onrender.com/grievances/date?range=${ranges.selectedRange}`;
        } else {
          url = `https://grievanceskhuntibacked.onrender.com/grievances/date?range=${ranges.selectedRange}&block=${loginuser}`;
        }
        const response = await axios.get(url);
        setGrievanceData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      setChartHeight(window.innerWidth * 0.2);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ranges, modalOpen, loginuser]);

  const calculatePercentages = (item) => {
    let sum = 0;
    let pending = 0;
    let rejected = 0;
    let completed = 0;

    if (item.stateCounts["1"]) {
      pending = item.stateCounts["1"];
      sum += pending;
    }
    if (item.stateCounts["2"]) {
      rejected = item.stateCounts["2"];
      sum += rejected;
    }
    if (item.stateCounts["3"]) {
      completed = item.stateCounts["3"];
      sum += completed;
    }

    return {
      block: item.block,
      percentageOfResponse: sum > 0 ? ((rejected + completed) / sum) * 100 : 0,
    };
  };

  const percentages = grievanceData?.map(calculatePercentages) || [];
  const chartData = [
    ["Blocks", "Percentage of Response"],
    ...percentages.map((item) => [item.block, item.percentageOfResponse]),
  ];
  // console.log(chartData, "chart data");

  return (
    <Box sx={{ position: "relative", padding: "0px 10px 0px 10px" }}>
      <Chart
        width={"100%"}
        height={chartHeight}
        chartType="Bar"
        data={chartData}
        options={{
          chart: {
            title: "Percentage of Response in Grievances",
            subtitle: "Blocks vs Percentage",
          },
          legend: { position: "none" },
        }}
      />
    </Box>
  );
};

export default BarChartBlock;
