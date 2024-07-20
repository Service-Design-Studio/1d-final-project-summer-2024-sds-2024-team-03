import React, { useEffect, useState } from "react";
import { Box, Grid} from '@mui/material';
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import { FileDrop } from "../components/UploadData/Uploader";

interface UploadDataProps {
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function UploadData({
  selectedProduct,
  setSelectedProduct,
  selectedSource,
  setSelectedSource,
}: UploadDataProps) {

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
      <h1>Upload Data</h1>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        mb: 7
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2,
          mb: 7,
          justifyContent: 'flex-start'
        }}>
          <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
            <FilterProduct
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              multiple={false}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
            <FilterSource
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              multiple={false}
            />
          </Box>
        </Box>
        <FileDrop
          selectedProduct={selectedProduct}
          selectedSource={selectedSource}
        />
      </Box>
    </Box>
  );
}

export {};
