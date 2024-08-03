import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import {SxProps} from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import Zoom from "@mui/material/Zoom";
import {useTheme} from "@mui/material/styles";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import {red} from "@mui/material/colors";
import {deepPurple} from "@mui/material/colors";
import {deepOrange} from "@mui/material/colors";
import {teal} from "@mui/material/colors";

import {Dayjs} from "dayjs";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
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
    },
};

interface DialogAddActionProps {
    // TYPESCRIPT: to make the variables strong type
    fromDate: Dayjs;
    toDate: Dayjs;
    selectedProduct: string[];
    selectedSource: string[];
    isDetailed: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
}

const urlPrefix =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jbaaam-yl5rojgcbq-et.a.run.app";

export default function FormDialog({
    // SYNTAX: {variable} : type of variable
    fromDate,
    toDate,
    selectedProduct,
    selectedSource,
    isDetailed,
    setRefresh,
}: DialogAddActionProps) {
    // useState: has a "getter" and setter, the end is the default value
    // useState VS Props: useState is for internal communication within a component, Props is for intercomponent communication
    const fromDate_string = fromDate.format("DD/MM/YYYY");
    const toDate_string = toDate.format("DD/MM/YYYY");
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
    const [selectedFeedbackcategories, setSelectedFeedbackcategories] =
        useState<string[]>([]);
    const [graphSubcategories, setGraphSubcategories] = useState<string[]>([]);
    const [graphFeedbackcategories, setGraphFeedbackcategories] = useState<
        string[]
    >([]);

    const [actionValue, setActionValue] = useState("");
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActionValue(event.target.value);
    };

    const [actionableCategory, setActionableCategory] = useState("");
    const handleActionableCategoryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setActionableCategory(event.target.value);
    };

    const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
        //extract the value for an event target within an event handler function
        const value = event.target.value; //value is what you select, event.target is used for selection
        setSelectedSubcategory((prevValue) =>
            prevValue === value ? "" : value
        ); //specify what is the selected subcat
        setSelectedFeedbackcategories([]); //reset the feedback_cat to blank when there is a change in subcat
    };

    const handleFeedbackcategoryChange = (
        event: SelectChangeEvent<string[]>
    ) => {
        const value = event.target.value;
        setSelectedFeedbackcategories(
            typeof value === "string" ? value.split(",") : value
        );
    };

    const handleAddClick = async () => {
        try {
            const response = await fetch(`${urlPrefix}/actionables.json`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    actionable: {
                        action: actionValue,
                        status: "In Progress",
                        subproduct: selectedSubcategory,
                        actionable_category: actionableCategory,
                        feedback_category: JSON.stringify(
                            selectedFeedbackcategories
                        ),
                        feedback_json: "[]",
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Success:", data);
            const random_val = Math.random();
            setRefresh(random_val);
            console.log("randomval", random_val);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    /* USE EFFECT: a hook executed at different times depending on how it's written

1. Initial Render, run only once at the start --> empty dependency array []
useEffect(() => {
  // Code to run on initial render
}, []);

2. On Every Render, useEffect runs after every render --> no dependency array
useEffect(() => {
  // Code to run after every render
});

3. On Specific State/Prop Change, useEffect only run when those dependencies change
useEffect(() => {
  // Code to run when selectedSubcategory changes
}, [selectedSubcategory]);

4. On Component Unmount, useEffect return cleanup function that runs when component unmount or before effect runs again
useEffect(() => {
  // Code to run on mount

  return () => {
    // Cleanup code to run on unmount
  };
}, []);

*/
    useEffect(() => {
        if (isDetailed) {
            fetch(
                `${urlPrefix}/analytics/get_sentiment_scores?fromDate=${fromDate_string}&toDate=${toDate_string}&product=${selectedProduct}&source=${selectedSource}`
            )
                .then((response) => response.json())
                .then((data: Record<string, string>[]) => {
                    if (data.length > 0) {
                        setGraphSubcategories(
                            //called when a unique list of subcategories extracted from data array
                            // iterate over data array and finds "subcategory", resulting in a new array containing only subcat values
                            // Set will store unique values of the subcat
                            Array.from(
                                new Set(
                                    data.map(({subcategory}) => subcategory)
                                )
                            )
                        );
                        const filteredSubcategories = data.filter((item) => {
                            //called to include items where subcat matches selectedsubcat
                            if (item.subcategory)
                                return item.subcategory.includes(
                                    selectedSubcategory
                                );
                        });
                        setGraphFeedbackcategories(
                            Array.from(
                                new Set(
                                    filteredSubcategories.map(
                                        ({feedback_category}) =>
                                            feedback_category
                                    )
                                )
                            )
                        );
                    }
                });
        }
    }, [
        fromDate,
        toDate,
        selectedProduct,
        selectedSource,
        selectedSubcategory,
        selectedFeedbackcategories,
    ]);

    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const fabStyle: SxProps = {
        position: "fixed",
        bottom: 72,
        right: 72,
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
    };

    const fab = {
        color: "secondary" as "secondary",
        sx: fabStyle,
        icon: <AddIcon />,
        label: "Add",
    };

    return (
        <React.Fragment>
            <Zoom
                key={fab.color}
                in={true}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${transitionDuration.exit}ms`,
                }}
                unmountOnExit
            >
                <Fab
                    sx={fab.sx}
                    aria-label={fab.label}
                    color={fab.color}
                    onClick={handleClickOpen}
                >
                    {fab.icon}
                </Fab>
            </Zoom>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(
                            (formData as any).entries()
                        );
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Add an Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter an action and choose its category. The
                        action will automatically be assigned the status 'In
                        Progress'.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="actionID"
                        name="actionName"
                        label="Enter Action"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={actionValue}
                        onChange={handleInputChange}
                    />

                    <Box sx={{display: "flex", gap: 2, mt: 1, width: "80%"}}>
                        <FormControl sx={{m: 0, width: "50%"}}>
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
                                    graphSubcategories
                                        .sort()
                                        .map((subcategory: string) => (
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
                        <FormControl
                            sx={{m: 0, width: "50%"}}
                            disabled={!selectedSubcategory}
                        >
                            <InputLabel id="detailed-sentimentscoregraph-filter-feedbackcategory-label">
                                Feedback Categories
                            </InputLabel>
                            <Select
                                labelId="detailed-sentimentscoregraph-filter-feedbackcategory-label"
                                id="detailed-sentimentscoregraph-filter-feedbackcategory"
                                multiple
                                value={selectedFeedbackcategories}
                                onChange={handleFeedbackcategoryChange}
                                input={
                                    <OutlinedInput
                                        id="detailed-sentimentscoregraph-select-feedbackcategory"
                                        label="feedbackcategory"
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
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {graphFeedbackcategories
                                    .sort()
                                    .map((feedbackcategory: string) => (
                                        <MenuItem
                                            key={feedbackcategory}
                                            value={feedbackcategory}
                                        >
                                            {feedbackcategory}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <FormControl>
                        <FormLabel
                            id="demo-radio-buttons-group-label"
                            sx={{mt: 2}}
                        >
                            Choose an Actionable Category
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={actionableCategory}
                            onChange={handleActionableCategoryChange}
                        >
                            <FormControlLabel
                                value="to Fix"
                                control={
                                    <Radio
                                        sx={{
                                            color: red[800],
                                            "&.Mui-checked": {
                                                color: red[600],
                                            },
                                        }}
                                    />
                                }
                                label="To Fix"
                            />
                            <FormControlLabel
                                value="to Keep In Mind"
                                control={
                                    <Radio
                                        sx={{
                                            color: deepPurple[800],
                                            "&.Mui-checked": {
                                                color: deepPurple[600],
                                            },
                                        }}
                                    />
                                }
                                label="To Keep In Mind"
                            />
                            <FormControlLabel
                                value="to Promote"
                                control={
                                    <Radio
                                        sx={{
                                            color: deepOrange[800],
                                            "&.Mui-checked": {
                                                color: deepOrange[600],
                                            },
                                        }}
                                    />
                                }
                                label="To Promote"
                            />
                            <FormControlLabel
                                value="to Amplify"
                                control={
                                    <Radio
                                        sx={{
                                            color: teal[800],
                                            "&.Mui-checked": {
                                                color: teal[600],
                                            },
                                        }}
                                    />
                                }
                                label="To Amplify"
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        type="submit"
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleAddClick}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
