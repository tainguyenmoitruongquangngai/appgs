import React, { ReactNode, createContext, useContext, useState } from "react";
import { injectLoading, injectNotification } from "../api/base";

interface LoadingContextProps {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}

interface NotificationContextProps {
  showMessage: (
    message: string,
    severity: "success" | "error" | "warning" | "info",
    options?: any
  ) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);
const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const ApiContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadingHandlers = {
    show: () => setIsLoading(true),
    hide: () => setIsLoading(false),
  };

  const notificationHandlers = {
    showMessage: (
      message: string,
      severity: "success" | "error" | "warning" | "info",
      options?: any
    ) => {
      // Trong React Native, có thể sử dụng Alert hoặc Toast
      console.log(`[${severity.toUpperCase()}] ${message}`, options);
      // TODO: Implement proper notification display (Toast, Alert, etc.)
    },
  };

  // Inject handlers vào API base
  React.useEffect(() => {
    injectLoading(loadingHandlers);
    injectNotification(notificationHandlers);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, ...loadingHandlers }}>
      <NotificationContext.Provider value={notificationHandlers}>
        {children}
      </NotificationContext.Provider>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within ApiContextProvider");
  }
  return context;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within ApiContextProvider");
  }
  return context;
};
