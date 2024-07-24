import React, {useState, useRef} from "react";
import {
    Box,
    Paper,
    Typography,
    Divider,
    Button,
    Dialog,
    DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs, {Dayjs} from "dayjs";
import Calendar from "../components/Calendar";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import OverallSentimentScore from "../components/Dashboard/OverallSentimentScore";
import SentimentDistribution from "../components/Dashboard/SentimentDistribution";
import SentimentScoreGraph from "../components/SentimentScoreGraph";
import CategoriesSunburstChart from "../components/Dashboard/CategoriesSunburstChart";
import SentimentCategoriesGraph from "../components/SentimentCategoriesGraph";
import domtoimage from "dom-to-image-more";
import {jsPDF} from "jspdf";

interface DashboardProps {
    setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    fromDate: Dayjs;
    setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    toDate: Dayjs;
    selectedProduct: string[];
    setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSource: string[];
    setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dashboard({
    setFromDate,
    fromDate,
    setToDate,
    toDate,
    selectedProduct,
    setSelectedProduct,
    selectedSource,
    setSelectedSource,
    setSelectedMenu,
}: DashboardProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

    const reportRefs = {
        OverallSentimentScoreRef: useRef<HTMLDivElement>(null),
        SentimentDistributionRef: useRef<HTMLDivElement>(null),
        // ActionablesRef
        SentimentScoreGraphRef: useRef<HTMLDivElement>(null),
        CategoriesSunburstChartRef: useRef<HTMLDivElement>(null),
        SentimentCategoriesGraphRef: useRef<HTMLDivElement>(null),
    };

    const handleGenerateReport = async () => {
        // Each page only until 210, 297
        let prevImageHeight = 0;
        let prevImageWidth = 0;
        let prevY = 0;
        const PADDING = 10;
        const MARGIN = 20;
        const PAGE_HEIGHT = 297;
        const LIMIT_Y = PAGE_HEIGHT - MARGIN;

        const pdf = new jsPDF();

        const addImageToPDF = async (
            ref: React.RefObject<HTMLDivElement>,
            x: number,
            y: number,
            scale: number
        ) => {
            if (ref.current) {
                const dataUrl = await domtoimage.toPng(ref.current);
                const imgProperties = pdf.getImageProperties(dataUrl);
                const pdfWidth = pdf.internal.pageSize.getWidth();

                const scaledWidth = (pdfWidth - MARGIN) * scale;
                const scaledHeight =
                    (imgProperties.height * scaledWidth) / imgProperties.width;

                if (y + scaledHeight > LIMIT_Y) {
                    pdf.addPage();
                    y = MARGIN;
                }

                pdf.addImage(
                    dataUrl,
                    "PNG",
                    MARGIN + x,
                    y,
                    scaledWidth,
                    scaledHeight
                );
                return [scaledWidth, scaledHeight];
            }
            return [0, 0];
        };

        const addText = (text: string, x: number, y: number) => {
            if (y + 10 > LIMIT_Y) {
                pdf.addPage();
                y = MARGIN;
            }
            pdf.text(text, x, y);
            return y + 10;
        };

        pdf.setFontSize(16);
        prevY = addText(
            `DBS VOCUS generated on ${dayjs().format("DD/MM/YYYY")}`,
            MARGIN,
            MARGIN
        );
        pdf.setFontSize(12);
        prevY = addText(
            `Report for ${dayjs(fromDate).format("DD/MM/YYYY")} - ${dayjs(
                toDate
            ).format("DD/MM/YYYY")}`,
            MARGIN,
            prevY
        );
        prevY = addText(
            `Products: ${selectedProduct.join(", ")}`,
            MARGIN,
            prevY
        );
        prevY = addText(`Sources: ${selectedSource.join(", ")}`, MARGIN, prevY);

        const addScaledImageToPDF = async (
            ref: React.RefObject<HTMLDivElement>,
            x: number,
            y: number
        ) => {
            const scale =
                ref === reportRefs.OverallSentimentScoreRef ||
                ref === reportRefs.SentimentDistributionRef
                    ? 0.35
                    : ref === reportRefs.CategoriesSunburstChartRef
                    ? 0.5
                    : 0.85;
            return await addImageToPDF(ref, x, y, scale);
        };

        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.OverallSentimentScoreRef,
            0,
            prevY + PADDING
        );

        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.SentimentDistributionRef,
            prevImageWidth + PADDING,
            prevY + PADDING
        );
        prevY += prevImageHeight + PADDING;

        prevY = addText("Additional Details:", MARGIN, prevY + PADDING);
        prevY = addText(
            "Details about the graphs or other insights.",
            MARGIN,
            prevY
        );

        prevY = MARGIN;
        pdf.addPage();
        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.SentimentScoreGraphRef,
            0,
            prevY
        );

        prevY = MARGIN;
        pdf.addPage();
        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.CategoriesSunburstChartRef,
            0,
            prevY
        );

        prevY = MARGIN;
        pdf.addPage();
        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.SentimentCategoriesGraphRef,
            0,
            prevY
        );

        const pdfDataUrl = pdf.output("dataurlstring");
        setPdfDataUrl(pdfDataUrl);
        setOpenDialog(true);
    };

    return (
        <Box
            sx={{
                maxWidth: "lg",
                mx: "auto",
                px: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Overview Dashboard</h1>
                <Button variant="outlined" onClick={handleGenerateReport}>
                    Generate Report
                </Button>
            </Box>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle
                    id="scroll-dialog-title"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontWeight: "bold",
                    }}
                >
                    PDF Preview
                    <Button
                        onClick={() => setOpenDialog(false)}
                        sx={{borderRadius: 4}}
                    >
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <Box sx={{p: 2}}>
                    {pdfDataUrl && (
                        <iframe
                            src={pdfDataUrl}
                            width="100%"
                            height="500px"
                        ></iframe>
                    )}
                </Box>
            </Dialog>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: {xs: "column", sm: "row"},
                    gap: 2,
                    mb: 7,
                    justifyContent: "flex-start",
                }}
            >
                <Box sx={{flexBasis: {xs: "100%", sm: "40%"}, flexGrow: 1}}>
                    <Calendar
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                    />
                </Box>
                <Box sx={{flexBasis: {xs: "100%", sm: "30%"}, flexGrow: 1}}>
                    <FilterProduct
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        multiple={true}
                    />
                </Box>
                <Box sx={{flexBasis: {xs: "100%", sm: "30%"}, flexGrow: 1}}>
                    <FilterSource
                        selectedSource={selectedSource}
                        setSelectedSource={setSelectedSource}
                        multiple={true}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "stretch",
                    flexDirection: "row",
                }}
            >
                <OverallSentimentScore
                    ref={reportRefs.OverallSentimentScoreRef}
                    fromDate={fromDate}
                    toDate={toDate}
                    selectedProduct={selectedProduct}
                    selectedSource={selectedSource}
                    setSelectedMenu={setSelectedMenu}
                />

                <SentimentDistribution
                    ref={reportRefs.SentimentDistributionRef}
                    fromDate={fromDate}
                    toDate={toDate}
                    selectedProduct={selectedProduct}
                    selectedSource={selectedSource}
                    setSelectedMenu={setSelectedMenu}
                />

                <Paper
                    sx={{
                        p: 2,
                        borderRadius: 4,
                        flex: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{width: "100%", fontWeight: "bold", mb: 2}}
                    >
                        New Action Items
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "top",
                            flexDirection: "row",
                            gap: 1,
                        }}
                    >
                        <Box sx={{flex: "1 1 25%", textAlign: "center"}}>
                            <Typography
                                variant="body1"
                                sx={{fontWeight: "bold"}}
                            >
                                To Promote
                            </Typography>
                            <Typography variant="body2" color="grey">
                                Maintain user-friendly staff
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{flex: "1 1 25%", textAlign: "center"}}>
                            <Typography
                                variant="body1"
                                sx={{fontWeight: "bold"}}
                            >
                                To Amplify
                            </Typography>
                            <Typography variant="body2" color="grey">
                                Price
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{flex: "1 1 25%", textAlign: "center"}}>
                            <Typography
                                variant="body1"
                                sx={{fontWeight: "bold"}}
                            >
                                Keep in Mind
                            </Typography>
                            <Typography variant="body2" color="grey">
                                More efficient card replacement
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{flex: "1 1 25%", textAlign: "center"}}>
                            <Typography
                                variant="body1"
                                sx={{fontWeight: "bold"}}
                            >
                                To Fix
                            </Typography>
                            <Typography variant="body2" color="grey">
                                PayLah! disruptions
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
                {/* setSelectedMenu = {setSelectedMenu} */}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "stretch",
                    gap: 2,
                    mt: 2,
                }}
            >
                <Box sx={{flex: 6, display: "flex", alignItems: "stretch"}}>
                    <SentimentScoreGraph
                        ref={reportRefs.SentimentScoreGraphRef}
                        fromDate={fromDate}
                        toDate={toDate}
                        selectedProduct={selectedProduct}
                        selectedSource={selectedSource}
                        isDetailed={false}
                        setSelectedMenu={setSelectedMenu}
                    />
                </Box>
                <Box sx={{flex: 4, display: "flex", alignItems: "stretch"}}>
                    <CategoriesSunburstChart
                        ref={reportRefs.CategoriesSunburstChartRef}
                        fromDate={fromDate}
                        toDate={toDate}
                        selectedProduct={selectedProduct}
                        selectedSource={selectedSource}
                        setSelectedMenu={setSelectedMenu}
                    />
                </Box>
            </Box>
            <SentimentCategoriesGraph
                ref={reportRefs.SentimentCategoriesGraphRef}
                fromDate={fromDate}
                toDate={toDate}
                selectedProduct={selectedProduct}
                selectedSource={selectedSource}
                isDetailed={false}
                setSelectedMenu={setSelectedMenu}
            />
        </Box>
    );
}
