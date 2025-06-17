import { DataTable } from "../components/data-table";
import { SectionCards } from "../components/section-cards";
import { useProblemStore } from "@/store/useProblemStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export default function HomePage() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
    console.log(problems);
  }, [getAllProblems]);

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
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6"></div>
          <DataTable data={problems} />
        </div>
      </div>
    </div>
  );
}
