import React, {useEffect, useState} from "react";
import FilterSource from "../components/FilterSource";
import {FileDrop} from "../components/UploadData/Uploader";
import Logs from "../components/UploadData/Logs";
import {
    Box,
    Grid,
    FormControl,
    Tooltip,
    InputLabel,
    Select,
    SelectChangeEvent,
    Chip,
    OutlinedInput,
    MenuItem,
} from "@mui/material";

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
        <Box
            sx={{
                maxWidth: "lg",
                mx: "auto",
                px: 2,
            }}
        >
            <h1>Upload Data</h1>
            <Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6} mb={7}>
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
                    <Grid item xs={6} mb={7}>
                        <FilterSource
                            selectedSource={selectedSource}
                            setSelectedSource={setSelectedSource}
                            multiple={false}
                        />
                    </Grid>
                </Grid>
                <Tooltip
                    title={
                        <span>
                            Upload Instructions:
                            <br />
                            <br />
                            1. Select the relevant subcategory and source. For
                            files with multiple subcategories (Eg. Social
                            Media), select "Others"
                            <br />
                            <br />
                            2. Upload your file and monitor the Upload Logs.
                            <br />
                            <br />
                            3.{" "}
                            <b>
                                Refresh or navigate back to the upload page
                            </b>{" "}
                            for updates (You may have to refresh multiple
                            times).
                            <br />
                            Upload is complete when the log states, "Data
                            classification completed and added to database."
                            <br />
                            <br />
                            4. Wait until the current upload finishes before
                            uploading another file.
                            <br />
                            If Upload is in progress, the log will state:
                            "Cannot proceed, the last process status was: IN
                            PROGRESS. Please wait until its status is SUCCESS."
                        </span>
                    }
                    placement="right-start"
                    arrow
                >
                    <Grid container columnSpacing={4}>
                        <Grid item xs={9}>
                            <FileDrop
                                selectedSubcategory={selectedSubcategory}
                                selectedSource={selectedSource}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Logs />
                        </Grid>
                    </Grid>
                </Tooltip>
            </Grid>
        </Box>
    );
}

export {};
