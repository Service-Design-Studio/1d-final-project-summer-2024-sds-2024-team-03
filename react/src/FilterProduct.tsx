import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
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

const products = [
  "Deposits",
  "Digital Banking App",
  "Contact Center",
  "Payments",
  "Cards",
  "Investments",
  "Financial GPS",
  "Self-Service Banking",
  "Remittance",
  "Webpage",
  "Others",
  "Secured Loans",
  "PayLah!",
  "Unsecured Loans",
  "Internet banking",
  "General Insurance",
];

export default function MultipleSelectChip() {
  const theme = useTheme();
  const [selectedProduct, setselectedProduct] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedProduct>) => {
    const {
      target: { value },
    } = event;
    setselectedProduct(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 0, width: "100%" }}>
        <InputLabel id="filter-product-label">Products</InputLabel>
        <Select
          labelId="filter-product-label"
          id="filter-product"
          multiple
          value={selectedProduct}
          onChange={handleChange}
          input={<OutlinedInput id="select-product" label="product" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {products.map((product) => (
            <MenuItem key={product} value={product}>
              {product}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
