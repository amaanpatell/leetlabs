import { DataTable } from "../components/data-table";
import { SectionCards } from "../components/section-cards";
import { useProblemStore } from "@/store/useProblemStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export default function HomePage() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  // Add this callback function
  const handleProblemDeleted = (deletedId) => {
    // Refetch all problems to ensure data is up to date
    getAllProblems();
  };

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6">
          <DataTable 
            data={problems} 
            onProblemDeleted={handleProblemDeleted} // Add this prop
          />
        </div>
      </div>
    </div>
  );
}