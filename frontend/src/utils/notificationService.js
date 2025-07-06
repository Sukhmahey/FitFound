import { toast } from 'react-toastify';
import { useNotification } from '../contexts/NotificationContext';
const useNotify = () => {
  const { isMuted } = useNotification();

  const notify = {
    success: (msg, options = {}) => !isMuted && toast.success(msg, options),
    error: (msg, options = {}) => !isMuted && toast.error(msg, options),
    info: (msg, options = {}) => !isMuted && toast.info(msg, options),
    warning: (msg, options = {}) => !isMuted && toast.warning(msg, options),
  };

  return notify;
};

export default useNotify;