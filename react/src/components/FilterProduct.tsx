import React, { useEffect, useState } from "react";
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

interface FilterProductProps {
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  multiple?: boolean;
}

export default function FilterProduct({
  selectedProduct,
  setSelectedProduct,
  multiple = true,
}: FilterProductProps) {
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    const urlPrefix =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
    fetch(`${urlPrefix}/analytics/filter_products`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.sort())
        setProducts(data.sort())
      });
  }, []);

  const theme = useTheme();
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedProduct(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: "100%" }}>
        <InputLabel id="filter-product-label">Products</InputLabel>
        <Select
          labelId="filter-product-label"
          id="filter-product"
          multiple={multiple} // Pass the `multiple` prop to the Select component
          value={selectedProduct}
          onChange={handleChange}
          input={<OutlinedInput id="select-product" label="product" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  className="filter-product-value"
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {products.map((product: string) => (
            <MenuItem
              key={product}
              value={product}
              className="filter-product-option"
            >
              {product}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}
