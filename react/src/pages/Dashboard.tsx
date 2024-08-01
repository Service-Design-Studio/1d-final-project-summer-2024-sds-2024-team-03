import React, {useRef, useEffect, useState} from "react";
import {Box, Paper, Typography, Divider, Button} from "@mui/material";
import dayjs, {Dayjs} from "dayjs";
import Calendar from "../components/Calendar";
import FilterProduct from "../components/FilterProduct";
import FilterSource from "../components/FilterSource";
import OverallSentimentScore from "../components/Dashboard/OverallSentimentScore";
import SentimentDistribution from "../components/Dashboard/SentimentDistribution";
import ActionsProgress from "../components/Dashboard/ActionsCompleted";
import SentimentScoreGraph from "../components/SentimentScoreGraph";
import CategoriesSunburstChart from "../components/Dashboard/CategoriesSunburstChart";
import SentimentCategoriesGraph from "../components/SentimentCategoriesGraph";
import domtoimage from "dom-to-image-more";
import {jsPDF} from "jspdf";
import useDetectScroll, {Direction} from "@smakss/react-scroll-direction";

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
    const {scrollDir, scrollPosition} = useDetectScroll();
    type CustomRef<T> = {
        img: T;
        reportDesc?: string;
    };

    const reportRefs = {
        OverallSentimentScoreRef: useRef<CustomRef<HTMLDivElement>>({
            img: document.createElement("div"),
            reportDesc: "",
        }),
        SentimentDistributionRef: useRef<CustomRef<HTMLDivElement>>({
            img: document.createElement("div"),
            reportDesc: "",
        }),
        ActionsProgressRef: useRef<CustomRef<HTMLDivElement>>({
            img: document.createElement("div"),
            reportDesc: "",
        }),
        SentimentScoreGraphRef: useRef<CustomRef<HTMLDivElement>>({
            img: document.createElement("div"),
            reportDesc: "",
        }),
        CategoriesSunburstChartRef: useRef<CustomRef<HTMLDivElement>>({
            img: document.createElement("div"),
            reportDesc: "",
        }),
        SentimentCategoriesGraphRef: useRef<CustomRef<HTMLDivElement>>({
            img: document.createElement("div"),
            reportDesc: "",
        }),
    };

    const handleGenerateReport = async () => {
        // Each page only until 210, 297
        let prevImageHeight = 0;
        let prevImageWidth = 0;
        let prevY = 0;
        const PADDING = 10;
        const MARGIN = 20;
        const PAGE_HEIGHT = 297;
        const PAGE_WIDTH = 210;
        const LIMIT_Y = PAGE_HEIGHT - MARGIN;

        const pdf = new jsPDF();

        const addImageToPDF = async (
            ref: React.RefObject<CustomRef<HTMLDivElement>>,
            x: number,
            y: number,
            scale: number
        ) => {
            if (ref.current && ref.current.img) {
                const blob = await domtoimage.toBlob(ref.current.img, {});
                const reader = new FileReader();
                return new Promise<[number, number]>((resolve) => {
                    reader.onloadend = () => {
                        const dataUrl = reader.result as string;
                        const imgProperties = pdf.getImageProperties(dataUrl);
                        const pdfWidth = pdf.internal.pageSize.getWidth();

                        const scaledWidth = (pdfWidth - MARGIN) * scale;
                        const scaledHeight =
                            (imgProperties.height * scaledWidth) /
                            imgProperties.width;

                        if (y + scaledHeight > LIMIT_Y) {
                            pdf.addPage();
                            y = MARGIN;
                        }

                        const borderRadius = 5;
                        pdf.setDrawColor(0, 0, 0);
                        pdf.setLineWidth(0.4);
                        pdf.roundedRect(
                            MARGIN + x - 1,
                            y - 1,
                            scaledWidth + 2,
                            scaledHeight + 2,
                            borderRadius,
                            borderRadius
                        );

                        pdf.addImage(
                            dataUrl,
                            "PNG",
                            MARGIN + x,
                            y,
                            scaledWidth,
                            scaledHeight
                        );
                        resolve([scaledWidth, scaledHeight]);
                    };
                    reader.readAsDataURL(blob);
                });
            }
            return [0, 0];
        };

        const addScaledImageToPDF = async (
            ref: React.RefObject<CustomRef<HTMLDivElement>>,
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

        const addText = (text: string, x: number, y: number, fontSize = 12) => {
            const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * MARGIN;
            const lines = pdf.splitTextToSize(text, pdfWidth);
            pdf.setFontSize(fontSize);

            lines.forEach((line: string) => {
                if (y + fontSize / 2 > LIMIT_Y) {
                    pdf.addPage();
                    y = MARGIN;
                }
                pdf.text(line, x, y);
                y += fontSize / 2;
            });

            return y;
        };

        pdf.setFontSize(16);
        prevY = addText(
            `DBS VOCUS generated on ${dayjs().format("DD MMM 'YY")}`,
            MARGIN,
            MARGIN,
            20
        );
        pdf.setFontSize(12);
        prevY = addText(
            `Report for ${dayjs(fromDate).format("DD MMM 'YY")} - ${dayjs(
                toDate
            ).format("DD MMM 'YY")}`,
            MARGIN,
            prevY,
            20
        );
        prevY = addText(
            `Products: ${selectedProduct.join(", ")}`,
            MARGIN,
            prevY,
            16
        );
        prevY = addText(
            `Sources: ${selectedSource.join(", ")}`,
            MARGIN,
            prevY,
            16
        );

        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.OverallSentimentScoreRef,
            0,
            prevY + PADDING
        );

        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.SentimentDistributionRef,
            PAGE_WIDTH - prevImageWidth - MARGIN - MARGIN,
            prevY + PADDING
        );
        prevY += prevImageHeight + PADDING;
        prevY = addText(
            reportRefs.OverallSentimentScoreRef.current?.reportDesc ?? "",
            MARGIN,
            prevY + PADDING
        );
        prevY = addText(
            reportRefs.SentimentDistributionRef.current?.reportDesc ?? "",
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
        prevY += prevImageHeight + PADDING;

        prevY = addText(
            reportRefs.SentimentScoreGraphRef.current?.reportDesc ?? "",
            MARGIN,
            prevY + PADDING
        );

        prevY = MARGIN;
        pdf.addPage();
        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.CategoriesSunburstChartRef,
            0,
            prevY
        );

        prevY += prevImageHeight + PADDING;
        prevY = addText(
            reportRefs.CategoriesSunburstChartRef.current?.reportDesc ?? "",
            MARGIN,
            prevY + PADDING
        );

        prevY = MARGIN;
        pdf.addPage();
        [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
            reportRefs.SentimentCategoriesGraphRef,
            0,
            prevY
        );

        prevY += prevImageHeight + PADDING;
        prevY = addText(
            reportRefs.SentimentCategoriesGraphRef.current?.reportDesc ?? "",
            MARGIN,
            prevY + PADDING
        );
        // prevY = MARGIN;
        // pdf.addPage();
        // [prevImageWidth, prevImageHeight] = await addScaledImageToPDF(
        //     reportRefs.SentimentCategoriesGraphRef,
        //     0,
        //     prevY
        // );

        // prevY += prevImageHeight + PADDING;
        // prevY = addText(
        //     reportRefs.SentimentCategoriesGraphRef.current?.reportDesc ?? "",
        //     MARGIN,
        //     prevY + PADDING
        // );

        pdf.setProperties({
            title: `${dayjs().format(
                "DD/MM/YYYY"
            )}_report_generated_for_${dayjs(fromDate).format(
                "DD/MM/YYYY"
            )}-${dayjs(toDate).format("DD/MM/YYYY")}`,
            subject: "DBS VOCUS",
            author: "SUTD JBAAAM!",
            keywords: "generated, javascript, web 2.0, ajax",
            creator: "SUTD JBAAAM!",
        });

        // const pdfDataUrl = pdf.output("dataurlstring");
        pdf.save(
            `${dayjs().format("DD/MM/YYYY")}_report_generated_for_${dayjs(
                fromDate
            ).format("DD/MM/YYYY")}-${dayjs(toDate).format("DD/MM/YYYY")}.pdf`
        );
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
                <Button
                    variant="outlined"
                    sx={{
                        backgroundColor: "#e80000",
                        color: "#fff",
                        border: 0,
                        fontWeight: "bold",
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: "#b80000",
                            border: 0,
                        },
                    }}
                    onClick={handleGenerateReport}
                >
                    Generate Report
                </Button>
            </Box>

            {/* Sticky, Freezes while scrolling */}
            <Box
                sx={{
                    position: "sticky",
                    top: 74,
                    display: "flex",
                    flexDirection: {xs: "column", sm: "row"},
                    gap: 2,
                    mb: 7,
                    // pb: 1,
                    justifyContent: "flex-start",
                    zIndex: 1000, // Ensure it's above other content
                    backgroundColor: scrollPosition.top > 0 ? "white" : null,
                    borderRadius: 4,
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
                    height: 230,
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
                <ActionsProgress
                    ref={reportRefs.ActionsProgressRef}
                    setSelectedMenu={setSelectedMenu}
                />
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
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "stretch",
                    gap: 2,
                    mt: 2,
                }}
            >
                <Box sx={{flex: 5, display: "flex", alignItems: "stretch"}}>
                    <CategoriesSunburstChart
                        ref={reportRefs.CategoriesSunburstChartRef}
                        fromDate={fromDate}
                        toDate={toDate}
                        selectedProduct={selectedProduct}
                        selectedSource={selectedSource}
                        setSelectedMenu={setSelectedMenu}
                    />
                </Box>
                <Box sx={{flex: 5, display: "flex", alignItems: "stretch"}}>
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
            </Box>
        </Box>
    );
}
