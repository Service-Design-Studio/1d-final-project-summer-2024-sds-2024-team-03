import React, { useEffect, useState } from "react";
import { Box, Grid} from '@mui/material';
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import { FileDrop } from "../components/UploadData/Uploader";

interface DashboardProps {
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Dashboard({
  selectedProduct,
  setSelectedProduct,
  selectedSource,
  setSelectedSource,
}: DashboardProps) {
  

  return (
    <>
      <h1>Upload Data</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={6}>
            <FilterProduct
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              multiple={false}
            />
          </Grid>
          <Grid xs={6}>
            <FilterSource
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              multiple={false}
            />
          </Grid>
          <Grid xs={12}>
            <FileDrop
              selectedProduct={selectedProduct}
              selectedSource={selectedSource}
            />
            </Grid>
        </Grid>
      </Box>
    </>
  );
}

export {};
