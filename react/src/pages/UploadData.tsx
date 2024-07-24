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
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);
  const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setSelectedSubcategory((prevValue) => (prevValue === value ? "" : value));
  };

  useEffect(() => {
    const urlPrefix =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jbaaam-yl5rojgcbq-et.a.run.app";
    fetch(`${urlPrefix}/analytics/filter_subcategory`)
      .then((response) => response.json())
      .then((data) => setSubcategories(data.sort()));
  }, []);

  return (
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
        <FormControl sx={{ m: 1, width: "50%" }}>
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
            {subcategories.length > 0 ? (
              subcategories.map((subcategory: string) => (
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
      <FileDrop
        selectedSubcategory={selectedSubcategory}
        selectedSource={selectedSource}
      />
    </Box>
  );
}

export {};
