import React, {useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import FilterSource from "../components/FilterSource";
import {FileDrop} from "../components/UploadData/Uploader";
import Logs from "../components/UploadData/Logs";

import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";

import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
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
    const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
        const {
            target: {value},
        } = event;
        setSelectedSubcategory((prevValue) =>
            prevValue === value ? "" : value
        );
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
        <Container maxWidth="lg" sx={{mx: "auto", px: 2}}>
            <h1>Upload Data</h1>
            <Grid container spacing={2} padding={2}>
                <Grid item xs={6} padding={1}>
                    <FormControl sx={{m: 0, width: "100%"}}>
                        <InputLabel
                            id="uploaddata-filter-subcategory-label"
                            sx={{fontWeight: "bold"}}
                        >
                            Subcategory
                        </InputLabel>
                        <Select
                            labelId="uploaddata-filter-subcategory-label"
                            id="uploaddata-filter-subcategory"
                            multiple={false}
                            value={selectedSubcategory}
                            onChange={handleSubcategoryChange}
                            input={
                                <OutlinedInput
                                    id="uploaddata-select-subcategory"
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
                                <MenuItem disabled>
                                    No data from selection
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} padding={1}>
                    <FilterSource
                        selectedSource={selectedSource}
                        setSelectedSource={setSelectedSource}
                        multiple={false}
                    />
                </Grid>
                <Grid item xs={9} padding={1}>
                    <FileDrop
                        selectedSubcategory={selectedSubcategory}
                        selectedSource={selectedSource}
                    />
                </Grid>
                <Grid xs={3} padding={1}>
                    <Logs />
                </Grid>
            </Grid>
        </Container>
    );
}

export {};
