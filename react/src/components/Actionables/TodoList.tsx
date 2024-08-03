import React, {useState, useEffect} from "react";
import {styled} from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, {AccordionProps} from "@mui/material/Accordion";
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import BuildCircleTwoToneIcon from "@mui/icons-material/BuildCircleTwoTone";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import MovingIcon from "@mui/icons-material/Moving";
import CampaignTwoToneIcon from "@mui/icons-material/CampaignTwoTone";
import TodoCard from "./TodoCard";

//Import Interfaces
import {Actionable} from "./Interfaces";
import {TodoListProps} from "./Interfaces";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
        borderBottom: 0,
    },
    "&::before": {
        display: "none",
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: "0.9rem"}} />}
        {...props}
    />
))(({theme}) => ({
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, .05)"
            : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

//default
export default function TodoList({data, setRefresh, forWidget}: TodoListProps) {
    //const TodoList: React.FC<TodoListProps> = ({ data, refresh }) => {
    const [expanded, setExpanded] = React.useState<string | false>("panel1");
    const handleChange =
        (panel: string) =>
        (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    // Categorise accordion by actionable_category
    const toFixData = data.filter(
        (item: Actionable) =>
            item.actionable_category.toLowerCase() === "to fix".toLowerCase()
    );

    const toKeepInMindData = data.filter(
        (item: Actionable) =>
            item.actionable_category.toLowerCase() ===
            "to keep in mind".toLowerCase()
    );

    const toPromoteData = data.filter(
        (item: Actionable) =>
            item.actionable_category.toLowerCase() ===
            "to promote".toLowerCase()
    );

    const toAmplifyData = data.filter(
        (item: Actionable) =>
            item.actionable_category.toLowerCase() ===
            "to amplify".toLowerCase()
    );

    return (
        <div>
            <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
            >
                <AccordionSummary
                    aria-controls={`${forWidget}-panel1d-content`}
                    id={`${forWidget}-panel1d-header`}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Box display="flex" alignItems="center" width="100%">
                        <Typography>To Fix</Typography>
                        <Box flexGrow={1} />
                        <BuildCircleTwoToneIcon
                            style={{color: "#9a031e", marginLeft: 8}}
                        />{" "}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {toFixData.map((item, i) => (
                        <TodoCard
                            key={item.id}
                            actionable={item}
                            setRefresh={setRefresh}
                            forWidget={`${forWidget}-${item.actionable_category}-${i}`}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
            >
                <AccordionSummary
                    aria-controls={`${forWidget}-panel2d-content`}
                    id={`${forWidget}-panel2d-header`}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Box display="flex" alignItems="center" width="100%">
                        <Typography>To Keep In Mind</Typography>
                        <Box flexGrow={1} />
                        <NotificationsActiveTwoToneIcon
                            style={{color: "#5f0f40", marginLeft: 8}}
                        />{" "}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {toKeepInMindData.map((item, i) => (
                        <TodoCard
                            key={item.id}
                            actionable={item}
                            setRefresh={setRefresh}
                            forWidget={`${forWidget}-${item.actionable_category}-${i}`}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
            >
                <AccordionSummary
                    aria-controls={`${forWidget}-panel3d-content`}
                    id={`${forWidget}-panel3d-header`}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Box display="flex" alignItems="center" width="100%">
                        <Typography>To Promote</Typography>
                        <Box flexGrow={1} />
                        <MovingIcon
                            style={{color: "#e36414", marginLeft: 8}}
                        />{" "}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {toPromoteData.map((item, i) => (
                        <TodoCard
                            key={item.id}
                            actionable={item}
                            setRefresh={setRefresh}
                            forWidget={`${forWidget}-${item.actionable_category}-${i}`}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
            >
                <AccordionSummary
                    aria-controls={`${forWidget}-panel4d-content`}
                    id={`${forWidget}-panel4d-header`}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Box display="flex" alignItems="center" width="100%">
                        <Typography>To Amplify</Typography>
                        <Box flexGrow={1} />
                        <CampaignTwoToneIcon
                            style={{color: "#0f4c5c", marginLeft: 8}}
                        />{" "}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {toAmplifyData.map((item, i) => (
                        <TodoCard
                            key={item.id}
                            actionable={item}
                            setRefresh={setRefresh}
                            forWidget={`${forWidget}-${item.actionable_category}-${i}`}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
