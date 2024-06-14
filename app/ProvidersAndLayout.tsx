"use client";

import { LargeScreenLayout } from "@/components/layouts/LargeScreenLayout";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { useRegisterServiceWorker } from "@/hooks/useRegisterServiceWorker";
import { ChildrenProps } from "@/types/ChildrenProps";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import React from "react";
import { Toaster } from "react-hot-toast";
import { TableProvider } from "@/contexts/TableContext";

export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
  const _ = useRegisterServiceWorker();

  return (
    {children}
    // <EnokiFlowProvider apiKey={process.env.NEXT_PUBLIC_ENOKI_API_KEY!}>
    //   <BalanceProvider>
    //     <TableProvider>
    //       <main
    //         className={`min-h-screen w-screen`}
    //         style={{
    //           backgroundImage: "url('/general/background.svg')",
    //           backgroundSize: "cover",
    //           backgroundPositionX: "center",
    //           backgroundPositionY: "top",
    //         }}
    //       >
    //         <LargeScreenLayout>{children}</LargeScreenLayout>
    //         <Toaster
    //           position="bottom-center"
    //           toastOptions={{
    //             duration: 5000,
    //           }}
    //         />
    //       </main>
    //     </TableProvider>
    //   </BalanceProvider>
    // </EnokiFlowProvider>
  );
};
