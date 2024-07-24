

import axios from "axios";
import { useContext, useEffect, useState } from "react";
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
  TextField,
  TablePagination,
  styled,
  Menu,
  MenuItem,
} from "@mui/material";
import "./index.css";
import dayjs from "dayjs";
import { MyContext } from "../../main";

const StyledTablePagination = styled(TablePagination)`
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  overflow: hidden;
`;

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
  const [grievancesData, setGrievancesData] = useState({
    grievances: [],
    totalPages: 0,
    totalItems: 0,
  });
  const [currentPage, setCurrentPage] = useState(0); // MUI TablePagination is zero-based
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  const [selectedState, setSelectedState] = useState("total");
  const { ranges, setRanges } = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [uniqueUser, setUniqueUser] = useState(0);
  const [services, setServices] = useState([]);

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

  useEffect(() => {
    const fetchGrievances = () => {
      let url = "";
      if (loginuser === "admin") {
        url = `http://20.197.12.216:7778/grievances?page=${
          currentPage + 1
        }&range=${ranges.selectedRange}&state=${selectedState}&limit=10`;
      } else {
        url = `http://20.197.12.216:7778/grievances?page=${
          currentPage + 1
        }&block=${loginuser}&range=${
          ranges.selectedRange
        }&state=${selectedState}&limit=10`;
      }

      axios
        .get(url)
        .then((res) => {
          setGrievancesData({
            grievances: res.data.grievances,
            totalPages: res.data.totalPages,
            totalItems: res.data.totalGrievances,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch grievances:", error);
        });
    };

    fetchGrievances();
    axios.get(`http://20.197.12.216:7778/services`).then((res)=>{
      setServices(res.data);

    }).catch((error)=>{
      console.log(error)
    })
  }, [currentPage, modalOpen, loginuser, ranges, selectedState]);

  useEffect(() => {
    axios
      .get(`http://20.197.12.216:7778/uniqueUser`)
      .then((res) => {
        setUniqueUser(res.data.totalUniqueUser);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const rows = grievancesData.grievances?.map((grievance) => ({
    name: grievance.body.name,
    block: grievance.body.block,
    village: grievance.body.village,
    complaint: grievance.body.complaint,
    sender: grievance.sender,
    status: getStatus(grievance.state),
    id: grievance._id,
    action: grievance.action,
    date: grievance.timestamp // Format date
  }));

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowClick = (grievance) => {
    setSelectedGrievance(grievance);
    setModalOpen(true);
    // console.log(grievance)
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGrievance(null);
  };

  const handleStateChange = (newState) => {
    axios
      .put(
        `http://20.197.12.216:7778/grievances/${selectedGrievance.id}`,
        {
          state: newState,
          action: Math.floor(Date.now() / 1000),
        }
      )
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
    setCurrentPage(0); // Reset page to 0 when changing status/filter
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
console.log(grievancesData,"ggg");
  return (
    <Paper sx={{ width: "100%" }} className="TableContainer">
      <div className="flex-container">
        <TextField
          select
          label="Select Status"
          value={selectedState}
          onChange={handleStatusChange}
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
        <div className="unique-user">Total Unique Visitors {uniqueUser}</div>
        <Button
          variant="outlined"
          onClick={handleMenuClick}
          className="dropdown-button"
        >
          Services Use
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              width: 200,
            },
          }}
        >
          {/* Replace these with your actual service details and counts */}
          {services.map((services, index) => {
            return (
              <MenuItem onClick={handleMenuClose} key={index}>
                {services.serviceName}  : {services.totalCount}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
      <TableContainer sx={{ maxHeight: 200 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: "rgb(2, 74, 73)",
                    color: "white",
                    height: "10px",
                    padding: "5px",
                    textAlign: "center",
                  }}
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
                  height: 30, // Adjust the height of the row
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center" // Center the text
                    sx={{
                      ...(column.id === "status" && {
                        backgroundColor:
                          row.status === "Rejected"
                            ? "rgb(242, 96, 59)"
                            : row.status === "Completed"
                            ? "rgb(131, 203, 84)"
                            : "rgb(226, 201, 111)",
                      }),
                      padding: "2px 16px 2px 16px",
                    }}
                  >
                    {row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <StyledTablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={grievancesData.totalItems}
          rowsPerPage={10}
          page={currentPage}
          onPageChange={handleChangePage}
          className="table-pagination"
        />
      </Box>

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
              <Typography sx={{ mt: 2 }} color="black">
                <strong>Status:</strong> {selectedGrievance.status}
              </Typography>
              <Typography sx={{ mt: 2 }} color="black">
                <strong>Date:</strong> {selectedGrievance.date}
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStateChange(2)}
                >
                  Mark as Completed
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleStateChange(3)}
                >
                  Reject
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default GrievancesTable;