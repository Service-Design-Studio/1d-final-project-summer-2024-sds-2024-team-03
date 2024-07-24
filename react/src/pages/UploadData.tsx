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

interface UploadDataProps {
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}
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

export default function UploadData({
  selectedProduct,
  setSelectedProduct,
  selectedSource,
  setSelectedSource,
}: UploadDataProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);
  const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setSelectedSubcategory((prevValue) => (prevValue === value ? "" : value));
  };
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
          <FormControl sx={{ m: 0, width: "50%" }}>
            <InputLabel id="detailed-sentimentscoregraph-filter-subcategory-label">
              Subcategories
            </InputLabel>
            <Select
              labelId="detailed-sentimentscoregraph-filter-subcategory-label"
              id="detailed-sentimentscoregraph-filter-subcategory"
              multiple={false}
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              input={
                <OutlinedInput
                  id="detailed-sentimentscoregraph-select-subcategory"
                  label="subcategory"
                  sx={{
                    borderRadius: 4,
                  }}
                />
              }
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                  }}
                >
                  <Chip key={selected} label={selected} />
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {graphSubcategories.length > 0 ? (
                graphSubcategories.map((subcategory: string) => (
                  <MenuItem
                    key={subcategory}
                    value={subcategory}
                    className="subcategory-option"
                  >
                    {subcategory}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No data from selection</MenuItem>
              )}
            </Select>
          </FormControl>
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
