import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import { FileDrop } from "../components/UploadData/Uploader";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";

interface UploadDataProps {}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: 18,
      marginTop: "18px",
    },
  },
};

export default function UploadData({}: UploadDataProps) {
  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string[]>([]);
  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
      <h1>Upload Data</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "flex-start",
          gap: 2,
          mb: 7,
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
          <FilterProduct
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            multiple={false}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
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
  );
}

export {};
