import React from "react";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import { Box } from "@mui/material";
import Survey from "../assets/survey.png";
import Testing from "../assets/testing.png";
import Equipment from "../assets/equipment.png";
import Design from "../assets/design.png";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Dashboard = ({ ThemeStyles }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/home');
  };
const background = {
  ...ThemeStyles,
  backgroundColor: '#FFFAFA'
}
  return (
    <div
      className="pb-40 px-5 py-7 w-full h-screen overflow-y-auto"
      style={background}
    >
      <Box className="justify-between flex mb-4" style={background}>
        <div>
          <h1 className="text-black text-3xl font-bold mb-2">UZURI LIMITED</h1>
          <h2 className="text-black text-2xl font-semibold mb-4 text-white-600">
            KARIBU KWENYE DASHBODI YA UZURI
          </h2>
        </div>
      </Box>

      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <Box className="bg-gray-100 p-4 shadow-md flex items-center">
          <div className="w-8 h-8 text-gray-500 mr-2">
            <DonutLargeIcon />
          </div>
          <div>
            <img
              src={Design}
              alt="Design & Construction"
              className="mr-4"
              style={{ width: "60px", height: "60px" }}
            />
            <h2 className="text-slate-900">Design & Construction</h2>
          </div>
        </Box>

        <Box className="bg-gray-100 p-4 shadow-md flex items-center">
          <div className="w-8 h-8 text-green-500 mr-4">
            <DonutLargeIcon />
          </div>
          <div>
            <img
              src={Testing}
              alt="Drilling & Test Pumping"
              className="mr-4"
              style={{ width: "60px", height: "60px" }}
            />
            <h2 className="text-slate-900">Drilling & Test Pumping</h2>
          </div>
        </Box>

        <Box className="bg-gray-100 p-4 shadow-md flex items-center">
          <div className="w-8 h-8 text-yellow-500 mr-4">
            <DonutLargeIcon />
          </div>
          <div>
            <img
              src={Survey}
              alt="Hydrogeological Survey & Report"
              className="mr-4"
              style={{ width: "60px", height: "60px" }}
            />
            <h2 className="text-slate-900">Hydrogeological Survey & Report</h2>
          </div>
        </Box>

        <Box className="bg-gray-100 p-4 shadow-md flex items-center">
          <div className="w-8 h-8 text-purple-500 mr-4">
            <DonutLargeIcon />
          </div>
          <div>
            <img
              src={Equipment}
              alt="Pump & Tank Installation"
              className="mr-4"
              style={{ width: "60px", height: "60px" }}
            />
            <h2 className="text-slate-900">Pump & Tank Installation</h2>
          </div>
        </Box>
      </Box>

      <Box className="p-4 flex flex-col sm:flex-row gap-4 justify-center">
        <div className="w-full sm:w-2/5 bg-gray-500 p-4 rounded-lg shadow dark:border-gray-700 dark:hover:bg-gray-700">
          <h3 className="font-bold text-md mb-2">Client Registration Form</h3>
          <Link to="/registerclient">
            <button className="bg-gray-600 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
              Client Registration Form
            </button>
          </Link>
        </div>

        <div className="w-full sm:w-2/5 bg-gray-500 p-4 rounded-lg shadow dark:border-gray-700 dark:hover:bg-gray-700">
          <h3 className="text-black font-bold text-md mb-2">Client List</h3>
          <Link to="/clientlist">
            <button className="bg-gray-600 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
               Client List
            </button>
          </Link>
        </div>
      
      <div className="w-full sm:w-2/5 bg-gray-500 p-4 rounded-lg shadow dark:border-gray-700 dark:hover:bg-gray-700">
          <h3 className="text-white font-bold text-md mb-2">Services List</h3>
          <Link to="/serviceslist">
            <button className="bg-gray-600 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
               Service List
            </button>
          </Link>
        </div>
        </Box>
      <Box className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-2/5 bg-gray-500 p-4 rounded-lg shadow dark:border-gray-700 dark:hover:bg-gray-700">
          <h3 className="font-bold text-md mb-2">Fee Calculator</h3>
          <Link to="/FeeCalculator">
            <button className="bg-gray-600 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
               Fee Calculator
            </button>
          </Link>
        </div>

        <div className="w-full sm:w-2/5 bg-gray-500 p-4 rounded-lg shadow dark:border-gray-700 dark:hover:bg-gray-700">
          <h3 className="text-black font-bold text-md mb-2">Reports</h3>
          <Link to="/reports">
            <button className="bg-gray-600 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
               Reports
            </button>
          </Link>
        </div>

        <div className="w-full sm:w-2/5 bg-gray-500 p-4 rounded-lg shadow dark:border-gray-700 dark:hover:bg-gray-700">
          <h3 className="font-bold text-md mb-2">Invoices</h3>
          <Link to="/invoice">
            <button className="bg-gray-600 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
               Invoices
            </button>
          </Link>
        </div>
      </Box>

      <button 
        className="py-2 px-3 mt-4 flex items-center justify-center bg-gray-500 text-white font-bold rounded-full focus:outline-none focus:shadow-outline hover:bg-gray-900"
        onClick={handleBackClick}
      >
         Logout
      </button>
    </div>
  );
};

export default Dashboard;


