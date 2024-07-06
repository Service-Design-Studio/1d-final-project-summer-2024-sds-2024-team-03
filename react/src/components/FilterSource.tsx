import  React, { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Box, Grid, OutlinedInput, InputLabel, MenuItem, FormControl} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const sources = [
  "Call Center",
  "Social Media",
  "Problem Solution Survey",
  "Product Survey with NPS",
  "Product Survey w/o NPS",
];
interface FilterSourceProps {
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FilterSource({
  selectedSource,
  setSelectedSource,
}: FilterSourceProps) {
  const [sources, setSources] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const urlPrefix =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
    fetch(`${urlPrefix}/analytics/filter_sources`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.sort())
        setSources(data.sort())});
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSource(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Grid item xs={3}>
      <FormControl sx={{ m: 0, width: "100%" }}>
        <InputLabel id="filter-source-label">Sources</InputLabel>
        <Select
          labelId="filter-source-label"
          id="filter-source"
          multiple
          value={selectedSource}
          onChange={handleChange}
          input={<OutlinedInput id="select-source" label="source" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} className="filter-source-value"/>
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {sources.map((source: string) => (
            <MenuItem key={source} value={source} className="filter-source-option">
              {source}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}
