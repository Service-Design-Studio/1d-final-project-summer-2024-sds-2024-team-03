import React, {useEffect, useState} from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTheme } from "@mui/material/styles";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Log {
    log_message: string;
    created_at: string;
}

export default function FolderList() {
    const theme = useTheme();
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        const urlPrefix =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://jbaaam-yl5rojgcbq-et.a.run.app";
        fetch(`${urlPrefix}/logs.json`)
            .then((response) => response.json())
            .then((data) =>
                setLogs(
                    data.sort(
                        (a: {created_at: string}, b: {created_at: string}) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    )
                )
            );
    }, []);
    console.log(logs);
    return (
        <Box sx={{width: "100%", maxWidth: 360, minHeight: 600, bgcolor: theme.palette.mode === "dark" ? "#222" : "#fff", borderRadius: 4}}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', px: 2, pt: 2, pb: 1 }}>
                Recent Uploads
            </Typography>
            {logs.length === 0 ? (
                <Box sx={{p: 2}}>
                    <Typography variant="body1" sx={{mb: 1}}>
                        No files found.
                    </Typography>
                    <Typography variant="body1">
                        The upload log may take a while to update.
                    </Typography>
                </Box>
            ) : (
                <List>
                    {logs.map((log, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={log.log_message}
                                secondary={dayjs(log.created_at)
                                    .tz("Asia/Singapore")
                                    .format("DD-MM-YYYY HH:mm:ss")}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}
