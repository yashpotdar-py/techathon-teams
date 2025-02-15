import React from "react";
import Grid from "@/app/components/Grid";
import "@/app/globals.css";

const grid = () => {
  return (
    <div style={{ position: "relative" }}>
      <Grid />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0)",
          zIndex: 9999,
          cursor: "none",
        }}
      />
    </div>
  );
};

export default grid;
