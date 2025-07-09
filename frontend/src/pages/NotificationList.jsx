import { useEffect, useState } from "react";
import { notificationApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
    Box,
    Typography,
    Stack,
    IconButton,
    Divider
} from "@mui/material";
import {
    InfoOutlined,
    CheckCircleOutline,
    WarningAmberOutlined,
    ErrorOutline,
    Done as DoneIcon
} from "@mui/icons-material";

const getTypeStyle = (type) => {
    switch (type.toLowerCase()) {
        case "success":
            return { icon: <CheckCircleOutline />, color: "#4caf50" };
        case "warning":
            return { icon: <WarningAmberOutlined />, color: "#ff9800" };
        case "error":
            return { icon: <ErrorOutline />, color: "#f44336" };
        default:
            return { icon: <InfoOutlined />, color: "#2196f3" };
    }
};

export default function NotificationList({ onUpdateUnreadCount }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user?.userId) {
            notificationApi
                .getByUser(user.userId)
                .then((res) => {
                    setNotifications(res.data);
                    const unread = res.data.filter(n => !n.read).length;
                    if (onUpdateUnreadCount) onUpdateUnreadCount(unread);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            await notificationApi.markAsRead(id);

            const unread = notifications.filter((n) => n._id !== id && !n.read).length;
            if (onUpdateUnreadCount) onUpdateUnreadCount(unread);
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    return (
        <Box sx={{ width: 1, px: 1 , backgroundColor: "#f1f9fc"}}>
            <Typography variant="h6" fontWeight={600} mb={2}>
                Notifications
            </Typography>

            <Stack spacing={1} sx={{p:1}}>
                {notifications.length === 0 ? (
                    <Typography color="text.secondary">You're all caught up 🎉</Typography>
                ) : (
                    notifications.map((n) => {
                        const { icon, color } = getTypeStyle(n.type);
                        return (
                            <Box
                                key={n._id}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: n.read ? "#e0e0e0" : "#d0d7de",
                                    backgroundColor: n.read ? "#f3f4f6" : "#ffffff",
                                    color: n.read ? "#757575" : "#212121",
                                    transition: "all 0.2s ease"
                                }}

                            >
                                <Box sx={{ color, mt: "4px" }}>{icon}</Box>

                                <Box flexGrow={1}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.primary"
                                        fontWeight={500}
                                        sx={{ mb: 0.3 }}
                                    >
                                        {n.type.toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {n.message}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.disabled"
                                        sx={{ mt: 0.5, display: "block" }}
                                    >
                                        {new Date(n.timestamp).toLocaleString()}
                                    </Typography>
                                </Box>

                                {!n.read && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleMarkAsRead(n._id)}
                                        sx={{
                                            color: "#9e9e9e",
                                            "&:hover": { color: "#4caf50" }
                                        }}
                                    >
                                        <DoneIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        );
                    })
                )}
            </Stack>
        </Box>
    );
}
