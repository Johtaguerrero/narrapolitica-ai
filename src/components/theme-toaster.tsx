"use client";

import { useTheme } from "@/components/theme-provider";
import { Toaster } from "sonner";

export function ThemeToaster() {
  const { theme } = useTheme();
  return <Toaster position="top-right" theme={theme === "dark" ? "dark" : "light"} />;
}
