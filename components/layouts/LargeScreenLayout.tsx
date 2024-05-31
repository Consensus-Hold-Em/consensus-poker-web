"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import React from "react";
import { TopNavbar } from "./TopNavbar";

export const LargeScreenLayout = ({ children }: ChildrenProps) => {

  return (
    <div className={`relative w-full h-full flex-col`}>
      <TopNavbar />
      <div className="flex-1 bg-grey-100 pt-[100px] h-full w-full flex flex-col">
        <div className="max-w-[1300px] mx-auto w-full h-full">{children}</div>
      </div>
    </div>
  );
};
