import React, { useEffect, useState } from "react";
import { IconButton, Badge, Popover } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationList from "./NotificationList";
import { notificationApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardBell() {
  const [bellAnchor, setBellAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const open = Boolean(bellAnchor);

  const handleOpen = (event) => {
    setBellAnchor(event.currentTarget);
  };

  const handleClose = () => setBellAnchor(null);

  useEffect(() => {
    if (user?.userId) {
      notificationApi.getByUser(user.userId).then((res) => {
        const unread = res.data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      });
    }
  }, [user]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{color:"#062F54"}}/>
        </Badge>
      </IconButton>

      <Popover
        open={open}
        bellAnchor={bellAnchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        
        PaperProps={{
          sx: { width: 360, borderRadius: 3, boxShadow: 3, p: 2, mt: 4 }
        }}
      >
        <NotificationList onUpdateUnreadCount={setUnreadCount} />
      </Popover>
    </>
  );
}
