import React, { Suspense, lazy } from "react";
import { Box } from "@mui/material";

const Authentication = lazy(() => import("./Authentication"));

const Home = ({ ThemeStyles }) => {
  return (
    <div
      className="pb-40 px-5 py-7 w-full h-screen overflow-y-auto"
      style={{
        ...ThemeStyles,
        backgroundImage: 'url("/src/assets/water.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box className="justify-between flex" style={ThemeStyles}>
        <div>
          <h1 className="text-gray-900 text-3xl font-bold mb-2">
            UZURI LIMITED
          </h1>
          <h2 className="text-2xl font-semibold">
            <span className="text-gray-900">KARIBU !</span>
          </h2>
        </div>
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <Authentication />
      </Suspense>
    </div>
  );
};

export default Home;
