import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
