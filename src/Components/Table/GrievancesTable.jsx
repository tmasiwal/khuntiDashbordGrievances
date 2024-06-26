import axios from "axios";
import { useContext,useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Box,
  Typography,
  Button,
  ButtonGroup,
  TextField,
} from "@mui/material";
import "./index.css";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MyContext } from "../../main";
const columns = [
  { id: "name", label: "Name", minWidth: 10 },
  { id: "block", label: "Block", minWidth: 10 },
  { id: "village", label: "Village", minWidth: 20 },
  { id: "complaint", label: "Complaint", minWidth: 50 },
  { id: "sender", label: "Sender", minWidth: 10 },
  { id: "status", label: "Status", minWidth: 10 },
  { id: "date", label: "Date", minWidth: 10 },
  { id: "action", label: "Action", minWidth: 10 },
];

const getStatus = (state) => {
  switch (state) {
    case 1:
      return "Pending";
    case 2:
      return "Completed";
    case 3:
      return "Rejected";
    default:
      return "Unknown";
  }
};

const GrievancesTable = ({ modalOpen, setModalOpen }) => {
  const [grievancesData, setGrievancesData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
 
  const [selectedState, setSelectedState] = useState("total");

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const { ranges, setRanges } = useContext(MyContext);

  useEffect(() => {
    const fetchGrievances = () => {
      
   
      const url =
        loginuser === "admin"
          ? `https://grievanceskhuntibacked.onrender.com/grievances?page=${currentPage}&range=${ranges.selectedRange}&state=${selectedState}`
          : `https://grievanceskhuntibacked.onrender.com/grievances?page=${currentPage}&block=${loginuser}&range=${ranges.selectedRange}&state=${selectedState}`;

      axios(url)
        .then((res) => setGrievancesData(res.data))
        .catch((error) => console.error("Failed to fetch grievances:", error));
    };

    fetchGrievances();
  }, [currentPage, modalOpen, loginuser, ranges, selectedState]);

  const rows = grievancesData.grievances?.map((grievance) => ({
    name: grievance.body.name,
    block: grievance.body.block,
    village: grievance.body.village,
    complaint: grievance.body.complaint,
    sender: grievance.sender,
    status: getStatus(grievance.state),
    id: grievance._id,
    action: grievance.action,
    date: grievance.timestamp,
  }));

  const handleButtonClick = (increment) => {
    setCurrentPage((prevPage) => prevPage + increment);
  };

  const handleRowClick = (grievance) => {
    setSelectedGrievance(grievance);
    console.log(grievance)
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGrievance(null);
  };

  const handleStateChange = (newState) => {
    axios
      .put(`https://grievanceskhuntibacked.onrender.com/grievances/${selectedGrievance.id}`, {
        state: newState,
        action: Math.floor(Date.now() / 1000),
      })
      .then(() => {
        setGrievancesData((prevData) => ({
          ...prevData,
          grievances: prevData.grievances.map((grievance) =>
            grievance._id === selectedGrievance.id
              ? { ...grievance, state: newState }
              : grievance
          ),
        }));
        handleCloseModal();
      })
      .catch((error) =>
        console.error("Failed to update grievance state:", error)
      );
  };

  const handleStatusChange = (e) => {
    
    setSelectedState(e.target.value);
  };

  return (
    <Paper
      sx={{ width: "100%", overflow: "auto" }}
      className="TableContainer"
    >
      <div className="flex-container">
        <div></div>

        <div className="buttonGroup-table ">
          <button
            disabled={currentPage === 1}
            onClick={() => handleButtonClick(-1)}
            className="button-table"
          >
            {currentPage - 1}
          </button>
          <p>Page {currentPage}</p>
          <button
            disabled={currentPage === grievancesData.totalPages}
            onClick={() => handleButtonClick(1)}
            className="button-table"
          >
            {currentPage + 1}
          </button>
        </div>

        <TextField
          select
          label="Select Status"
          value={selectedState}
          onChange={(e) => handleStatusChange(e)}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          margin="normal"
          size="small"
          className="text-field common-size"
        >
          <option value="2">Completed</option>
          <option value="3">Rejected</option>
          <option value="1">Pending</option>
          <option value="total">All Grievances</option>
        </TextField>
      </div>
      <TableContainer sx={{ maxHeight: 190 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                  sx={{ backgroundColor: "rgb(2, 74, 73)", color: "white" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={index}
                onClick={() => handleRowClick(row)}
                sx={{
                  backgroundColor:
                    row.status === "Rejected"
                      ? "rgb(242, 96, 59)"
                      : row.status === "Completed"
                      ? "rgb(131, 203, 84)"
                      : "rgb(226, 201, 111)",
                }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="grievance-modal-title"
        aria-describedby="grievance-modal-description"
      >
        <Box sx={modalStyle}>
          {selectedGrievance && (
            <>
              <Typography
                id="grievance-modal-title"
                variant="h6"
                component="h2"
                color="black"
              >
                Grievance Details
              </Typography>
              <Typography
                id="grievance-modal-description"
                sx={{ mt: 2 }}
                color="black"
              >
                <strong>Name:</strong> {selectedGrievance.name}
              </Typography>
              <Typography sx={{ mt: 2 }} color="black">
                <strong>Block:</strong> {selectedGrievance.block}
              </Typography>
              <Typography sx={{ mt: 2 }} color="black">
                <strong>Village:</strong> {selectedGrievance.village}
              </Typography>
              <Typography sx={{ mt: 2 }} color="black">
                <strong>Complaint:</strong> {selectedGrievance.complaint}
              </Typography>
              <Typography sx={{ mt: 2 }} color="black">
                <strong>Sender:</strong> {selectedGrievance.sender}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography sx={{ mt: 2 }} color="black">
                  <strong>Status:</strong> {selectedGrievance.status}
                </Typography>
                <Typography sx={{ mt: 2 }} color="black">
                  <strong>Date:</strong> {selectedGrievance.date}
                </Typography>
              </Box>
              <ButtonGroup variant="contained" sx={{ mt: 2 }}>
                <Button onClick={() => handleStateChange(1)}>Pending</Button>
                <Button onClick={() => handleStateChange(2)}>Completed</Button>
                <Button onClick={() => handleStateChange(3)}>Rejected</Button>
              </ButtonGroup>
            </>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default GrievancesTable;
