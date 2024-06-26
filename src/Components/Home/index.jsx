import React, { useState } from 'react'
import "./index.css"
import PieChartHiglight from '../Charts/PieChart/PieChart'
import BarChartBlock from '../Charts/BarChart/BarChartBlock'
import BarChartwithTime from '../Charts/BarChart/BarChartwithTime'
import GrievancesTable from '../Table/GrievancesTable'
const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="home-main">
      <div className="content2">
        <GrievancesTable modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </div>
      <div className="content1">
        <div className="charts">
          <div className="charts-head1">
            <img />
            <p>Grievance Summary: Pie Chart Representation</p>
          </div>
          <PieChartHiglight modalOpen={modalOpen} />
        </div>
        <div className="charts">
          <div className="charts-head2">
            <img />
            <p>Block-wise Grievance Distribution: Bar Chart Analysis</p>
          </div>
          <BarChartBlock modalOpen={modalOpen} />
        </div>
        <div className="charts">
          <div className="charts-head4">
            <img />
            <p>Yearly and Monthly Grievance Distribution</p>
          </div>
          <BarChartwithTime />
        </div>
      </div>
      {/* <div className="content2">
        <div className="charts">
          <div className="charts-head4">
            <img />
            <p>Yearly and Monthly Grievance Distribution</p>
          </div>
          <BarChartwithTime modalOpen={modalOpen} />
        </div>
      </div> */}
    </div>
  );
}

export default Home
