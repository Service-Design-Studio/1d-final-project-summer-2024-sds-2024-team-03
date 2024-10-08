import React, {useEffect, useState} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {
    Box,
    Grid,
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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
        sx: {boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)"},
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
    const theme = useTheme();
    const [products, setProducts] = useState<string[]>([]);

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        fetch(`${urlPrefix}/analytics/filter_products`)
            .then((response) => response.json())
            .then((data) => setProducts(data.sort()));
    }, []);

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: {value},
        } = event;
        setSelectedProduct(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <Grid item xs={3}>
            <FormControl sx={{m: 0, width: "100%"}}>
                <InputLabel id="filter-product-label" sx={{fontWeight: "bold"}}>
                    Products
                </InputLabel>
                <Select
                    labelId="filter-product-label"
                    id="filter-product"
                    multiple={multiple} // Pass the `multiple` prop to the Select component
                    value={selectedProduct}
                    onChange={handleChange}
                    input={
                        <OutlinedInput
                            id="select-product"
                            label="product"
                            sx={{borderRadius: 4}}
                        />
                    }
                    renderValue={(selected) => (
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
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
                    {products.length > 0 ? (
                        products.map((product: string) => (
                            <MenuItem
                                key={product}
                                value={product}
                                className="filter-product-option"
                            >
                                {product}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No data</MenuItem>
                    )}
                </Select>
            </FormControl>
        </Grid>
    );
}
