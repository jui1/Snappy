import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    console.log("Stored User Data:", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.username || "Guest");
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserName("Guest"); // Fallback in case of parsing error
      }
    } else {
      setUserName("Guest"); // If localStorage is empty
    }
  }, []);

  return (
    <Container>
      <img src={Robot} alt="Welcome Robot" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
