import React, { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { MyContext } from "../../main";

const Navbars = () => {
  const { ranges, setRanges } = useContext(MyContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayedTimeRange, setDisplayedTimeRange] = useState("Today");
  const [isNavExpanded, setIsNavExpanded] = useState(false); // Track navbar expansion

  const handleLogout = () => {
    localStorage.removeItem("loginuser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const checkLoggedIn = () => {
    const user = localStorage.getItem("loginuser");
    return user ? true : false;
  };

  const handleChange = (e) => {
    setRanges({ selectedRange: e });
    setDisplayedTimeRange(e.charAt(0).toUpperCase() + e.slice(1));
    setIsNavExpanded(false); // Close navbar
  };

  useEffect(() => {
    setIsLoggedIn(checkLoggedIn());
    localStorage.setItem("selectedRange", ranges.selectedRange);
  }, [ranges.selectedRange]);

  return (
    <Navbar
      expand="lg"
      className="bg-indigo-200 border-bottom px-3 navbar-custom navbar-bg-color"
      style={{ color: "white" }}
      expanded={isNavExpanded} // Set expanded state
    >
      <Container fluid>
        <Navbar.Brand href="/">खूँटी KHUNTI</Navbar.Brand>
        <Navbar.Toggle
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          aria-controls="navbarScroll"
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="my-2 my-lg-0 ms-auto" navbarScroll>
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
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
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
