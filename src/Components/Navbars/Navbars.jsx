import React, { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./index.css";
import { MyContext } from "../../main"; // Adjust the import path accordingly

const Navbars = () => {
  const { ranges, setRanges } = useContext(MyContext);
  const navigate = useNavigate(); // Initialize navigate hook
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Define isLoggedIn state
  const [displayedTimeRange, setDisplayedTimeRange] = useState("Today");

  // Function to handle logout
  const handleLogout = () => {
    // Remove user authentication token or information from local storage
    localStorage.removeItem("loginuser");
    // console.log("hello logout!");
    setIsLoggedIn(false)
    // Redirect user to login page
    navigate("/login");
  };

  // Check if the user is logged in based on localStorage
  const checkLoggedIn = () => {
    const user = localStorage.getItem("loginuser");
    // console.log(user, "nav");
    return user ? true : false;
  };

  const handleChange = (e) => {
    setRanges({ selectedRange: e });
    if (e === "today") {
      setDisplayedTimeRange("Today");
    } else if (e === "week") {
      setDisplayedTimeRange("Last week");
    } else if (e === "month") {
      setDisplayedTimeRange("Last Month");
    } else if (e === "year") {
      setDisplayedTimeRange("Last Year");
    } else if (e === "total") {
      setDisplayedTimeRange("Total Grievance");
    }
  };

  // Set initial login state
  useEffect(() => {
    setIsLoggedIn(checkLoggedIn());
    localStorage.setItem("selectedRange", ranges.selectedRange);
  }, [ranges.selectedRange]);

  return (
    <Navbar
      expand="lg"
      className="bg-indigo-200 border-bottom px-3 navbar-custom"
      style={{ color: "white" }}
    >
      <Container fluid>
        <Navbar.Brand href="/">खूँटी KHUNTI</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="my-2 my-lg-0 ms-auto"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavDropdown title={displayedTimeRange} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => handleChange("today")}>
                Today
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleChange("week")}>
                Last Week
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleChange("month")}>
                Last Month
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleChange("year")}>
                Last Year
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleChange("total")}>
                Total Grievance
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/">Home</Nav.Link>
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link> // Logout button
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbars;
