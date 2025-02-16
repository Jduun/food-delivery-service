import BottomBar from "@/components/bottombar";
import TopBar from "@/components/topbar";
import * as React from "react";

interface IPageTemplateProps {
  children: React.ReactNode;
}

export default function PageTemplate({ children }: IPageTemplateProps) {
  return (
    <>
      <TopBar />
      {children}
      <BottomBar />
    </>
  );
}
