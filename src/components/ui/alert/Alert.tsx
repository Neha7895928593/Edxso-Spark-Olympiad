import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  AlertIcon,
  InfoIcon,
  CloseIcon,
  CloseLineIcon,
} from '@/icons/index';

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
  duration?: number;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
  duration = 5000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const variants = {
    success: {
      container:
        "bg-green-50 border border-green-500 text-green-700 dark:bg-green-900/10 dark:border-green-500/50",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />,
    },
    error: {
      container:
        "bg-red-50 border border-red-500 text-red-700 dark:bg-red-900/10 dark:border-red-500/50",
      icon: <CloseIcon className="w-5 h-5 text-red-600 dark:text-red-400" />,
    },
    warning: {
      container:
        "bg-yellow-50 border border-yellow-500 text-yellow-700 dark:bg-yellow-900/10 dark:border-yellow-500/50",
      icon: <AlertIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
    },
    info: {
      container:
        "bg-blue-50 border border-blue-500 text-blue-700 dark:bg-blue-900/10 dark:border-blue-500/50",
      icon: <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
  };

  const current = variants[variant];

  return (
    <div
      className={`w-full max-w-md mx-auto relative flex items-start gap-3 p-4 rounded-xl shadow-md transition-all duration-300 animate-fade-in ${current.container}`}
      role="alert"
    >
      <div className="pt-1">{current.icon}</div>
      <div className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-base">{title}</span>
        <span className="leading-snug">{message}</span>
        {showLink && linkHref && (
          <Link
            href={linkHref}
            className="text-sm underline font-medium text-current hover:opacity-80"
          >
            {linkText}
          </Link>
        )}
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white"
        aria-label="Close"
      >
        <CloseLineIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;
