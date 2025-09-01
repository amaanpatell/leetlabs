"use client";

import * as React from "react";
import {
  IconDotsVertical,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { Loader2 } from "lucide-react";

export const schema = z.object({
  id: z.number(),
  title: z.string(),
  difficulty: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  company: z.string().optional(),
  acceptance: z.string().optional(),
});

// Difficulty styles mapping - moved outside component for better performance
const DIFFICULTY_STYLES = {
  easy: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  medium:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  hard: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  default:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
};

// Memoized Difficulty Cell Component
const DifficultyCell = React.memo(({ difficulty }) => {
  const styleKey = difficulty?.toLowerCase() || "default";
  const style = DIFFICULTY_STYLES[styleKey] || DIFFICULTY_STYLES.default;

  return (
    <div className="w-20">
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${style}`}
      >
        {difficulty}
      </span>
    </div>
  );
});

DifficultyCell.displayName = "DifficultyCell";

// Memoized Actions Dropdown
const ActionsDropdown = React.memo(({ problem }) => {
  const { authUser } = useAuthStore();
  const { playlist, isLoading, getAllPlaylists, addProblemToPlaylist } =
    usePlaylistStore();

  const [isPlaylistSelectionOpen, setIsPlaylistSelectionOpen] =
    React.useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(false); // added controlled open state

  const validPlaylists = React.useMemo(() => {
    if (!playlist || !Array.isArray(playlist)) return [];
    return playlist.filter((playlist) => playlist?.id);
  }, [playlist]);

  const handleDialogOpen = React.useCallback(() => {
    setMenuOpen(false); // ensure dropdown closes before dialog opens
    setIsPlaylistSelectionOpen(true);
    if (!playlist || playlist.length === 0) {
      getAllPlaylists();
    }
  }, [playlist, getAllPlaylists]);

  const handleDialogClose = React.useCallback((open) => {
    setIsPlaylistSelectionOpen(open);
    if (!open) {
      setSelectedPlaylist("");
      setMenuOpen(false); // ensure menu is closed on dialog close
    }
  }, []);

  const handleAddToPlaylist = React.useCallback(async () => {
    if (!selectedPlaylist || !problem?.id) return;
    try {
      await addProblemToPlaylist(selectedPlaylist, problem.id);
      setIsPlaylistSelectionOpen(false);
      setSelectedPlaylist("");
      setMenuOpen(false); // also close menu after successful add
    } catch (error) {
      console.error("Failed to add problem to playlist:", error);
    }
  }, [selectedPlaylist, problem?.id, addProblemToPlaylist]);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={handleDialogOpen}>
            Add to Playlist
          </DropdownMenuItem>
          {authUser?.role === "ADMIN" && (
            <>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isPlaylistSelectionOpen && (
        <Dialog open={isPlaylistSelectionOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add to Playlist</DialogTitle>
              <DialogDescription>
                Choose a playlist to add "{problem?.title || "this problem"}"
                to.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading playlists...
                  </span>
                </div>
              ) : validPlaylists.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Select a Playlist</h4>
                  <RadioGroup
                    value={selectedPlaylist}
                    onValueChange={setSelectedPlaylist}
                    className="space-y-3"
                  >
                    {validPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="flex items-start space-x-3 space-y-0"
                      >
                        <RadioGroupItem
                          value={playlist.id.toString()}
                          id={playlist.id.toString()}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={playlist.id.toString()}
                          className="flex-1 cursor-pointer justify-between"
                        >
                          <div className="font-medium">{playlist.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {playlist.problems?.length || 0} problems
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="text-sm">
                    You don't have any playlists yet.
                  </div>
                  <div className="text-sm">
                    Create a playlist first to add problems to it.
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {validPlaylists.length > 0 && (
                <Button
                  onClick={handleAddToPlaylist}
                  disabled={!selectedPlaylist || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add to Playlist"
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});

ActionsDropdown.displayName = "ActionsDropdown";

// Memoized Title Cell Component
const TitleCell = React.memo(({ problem }) => {
  const navigate = useNavigate();

  const handleTitleClick = React.useCallback(() => {
    navigate(`/problem/${problem.id}`);
  }, [navigate, problem.id]);

  return (
    <Button
      variant="link"
      className="text-foreground w-fit px-0 text-left h-auto font-medium hover:underline"
      onClick={handleTitleClick}
    >
      {problem.title}
    </Button>
  );
});

TitleCell.displayName = "TitleCell";

// Memoized Tags Cell Component
const TagsCell = React.memo(({ tags }) => (
  <div className="flex flex-wrap gap-1 max-w-48">
    {tags?.slice(0, 2).map((tag, index) => (
      <Badge key={index} variant="secondary" className="text-xs">
        {tag}
      </Badge>
    ))}
  </div>
));

TagsCell.displayName = "TagsCell";

// Memoized column definitions with solved problems logic
const useColumns = (solvedProblems) =>
  React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          // Calculate how many rows on current page are solved
          const currentPageRows = table.getRowModel().rows;
          const solvedRowsOnPage = currentPageRows.filter((row) =>
            solvedProblems.includes(row.original.id)
          );
          const allPageRowsSolved =
            currentPageRows.length > 0 &&
            solvedRowsOnPage.length === currentPageRows.length;
          const somePageRowsSolved =
            solvedRowsOnPage.length > 0 &&
            solvedRowsOnPage.length < currentPageRows.length;

          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={
                  allPageRowsSolved || (somePageRowsSolved && "indeterminate")
                }
                disabled={true} // Disable manual selection
                aria-label="Select all"
                className="cursor-not-allowed"
              />
            </div>
          );
        },
        cell: ({ row }) => {
          const isSolved = solvedProblems.includes(row.original.id);
          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={isSolved}
                disabled={true} // Disable manual selection
                aria-label="Select row"
                className="cursor-not-allowed"
              />
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <TitleCell problem={row.original} />,
        enableHiding: false,
      },
      {
        accessorKey: "difficulty",
        header: "Difficulty",
        cell: ({ row }) => (
          <DifficultyCell difficulty={row.original.difficulty} />
        ),
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => (
          <div className="w-24">
            <span className="text-sm font-medium">
              {row.original.company || "N/A"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => <TagsCell tags={row.original.tags} />,
      },
      {
        accessorKey: "acceptance",
        header: () => <div className="text-right">Acceptance</div>,
        cell: ({ row }) => (
          <div className="text-right font-mono text-sm w-20">
            {row.original.acceptance || "N/A"}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <ActionsDropdown problem={row.original} />,
      },
    ],
    [JSON.stringify(solvedProblems)]
  );

// Custom hook for filter logic
const useFilters = (data) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [companyFilter, setCompanyFilter] = React.useState("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [tagsFilter, setTagsFilter] = React.useState("all");

  const companies = React.useMemo(() => {
    const uniqueCompanies = Array.from(
      new Set(data.map((item) => item.company).filter(Boolean))
    );
    return uniqueCompanies.sort();
  }, [data]);

  const allTags = React.useMemo(() => {
    const tags = data.flatMap((item) => item.tags || []);
    return Array.from(new Set(tags)).sort();
  }, [data]);

  const deferredSearch = React.useDeferredValue(searchTerm);

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        !deferredSearch ||
        item.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(deferredSearch.toLowerCase());

      const matchesCompany =
        companyFilter === "all" || item.company === companyFilter;
      const matchesDifficulty =
        difficultyFilter === "all" ||
        item.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesTags =
        tagsFilter === "all" || (item.tags && item.tags.includes(tagsFilter));

      return (
        matchesSearch && matchesCompany && matchesDifficulty && matchesTags
      );
    });
  }, [data, deferredSearch, companyFilter, difficultyFilter, tagsFilter]);

  const clearFilters = React.useCallback(() => {
    setSearchTerm("");
    setCompanyFilter("all");
    setDifficultyFilter("all");
    setTagsFilter("all");
  }, []);

  const hasActiveFilters =
    searchTerm ||
    companyFilter !== "all" ||
    difficultyFilter !== "all" ||
    tagsFilter !== "all";

  return {
    searchTerm,
    setSearchTerm,
    companyFilter,
    setCompanyFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagsFilter,
    setTagsFilter,
    companies,
    allTags,
    filteredData,
    clearFilters,
    hasActiveFilters,
  };
};

// Memoized Filter Summary Component
const FilterSummary = React.memo(
  ({
    searchTerm,
    companyFilter,
    difficultyFilter,
    tagsFilter,
    resultCount,
  }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
      <span>Filters applied:</span>
      {searchTerm && (
        <Badge variant="secondary" className="text-xs">
          Search: "{searchTerm}"
        </Badge>
      )}
      {companyFilter !== "all" && (
        <Badge variant="secondary" className="text-xs">
          Company: {companyFilter}
        </Badge>
      )}
      {difficultyFilter !== "all" && (
        <Badge variant="secondary" className="text-xs">
          Difficulty: {difficultyFilter}
        </Badge>
      )}
      {tagsFilter !== "all" && (
        <Badge variant="secondary" className="text-xs">
          Tag: {tagsFilter}
        </Badge>
      )}
      <span>({resultCount} total results)</span>
    </div>
  )
);

FilterSummary.displayName = "FilterSummary";

export function DataTable({ data: initialData, solvedProblems = [] }) {
  // Extract solved problem IDs from the data structure
  const solvedProblemIds = React.useMemo(() => {
    if (!initialData) return [];

    const solvedIds = new Set();
    initialData.forEach((problem) => {
      if (problem.ProblemSolved && problem.ProblemSolved.length > 0) {
        solvedIds.add(problem.id);
      }
    });

    // Also include any IDs from the solvedProblems prop
    solvedProblems.forEach((id) => solvedIds.add(id));

    return Array.from(solvedIds);
  }, [initialData, solvedProblems]);
  const columns = useColumns(solvedProblemIds);

  const {
    searchTerm,
    setSearchTerm,
    companyFilter,
    setCompanyFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagsFilter,
    setTagsFilter,
    companies,
    allTags,
    filteredData,
    clearFilters,
    hasActiveFilters,
  } = useFilters(initialData);

  // Table state - removed rowSelection as it's now controlled by solvedProblems
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Create row selection state based on solved problems
  const rowSelection = React.useMemo(() => {
    const selection = {};
    filteredData.forEach((item) => {
      if (solvedProblemIds.includes(item.id)) {
        selection[item.id] = true;
      }
    });
    return selection;
  }, [filteredData, solvedProblemIds]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection, // Use computed row selection
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: false, // Disable row selection since it's controlled by solvedProblems
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Calculate solved problems count for display
  const solvedProblemsCount = React.useMemo(() => {
    return filteredData.filter((item) => solvedProblemIds.includes(item.id))
      .length;
  }, [filteredData, solvedProblemIds]);

  // Add CSS for hiding scrollbar
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .data-table-container, .data-table-scroll {
        scrollbar-width: none !important; /* Firefox */
        -ms-overflow-style: none !important; /* Internet Explorer 10+ */
      }
      .data-table-container::-webkit-scrollbar,
      .data-table-scroll::-webkit-scrollbar {
        display: none !important; /* WebKit */
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      .data-table-container::-webkit-scrollbar-track,
      .data-table-scroll::-webkit-scrollbar-track {
        display: none !important;
      }
      .data-table-container::-webkit-scrollbar-thumb,
      .data-table-scroll::-webkit-scrollbar-thumb {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="w-full flex-col justify-start gap-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-full sm:w-28">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tagsFilter} onValueChange={setTagsFilter}>
              <SelectTrigger className="w-full sm:w-24">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter summary */}
        {hasActiveFilters && (
          <FilterSummary
            searchTerm={searchTerm}
            companyFilter={companyFilter}
            difficultyFilter={difficultyFilter}
            tagsFilter={tagsFilter}
            resultCount={filteredData.length}
          />
        )}
      </div>

      <div
        className="relative flex flex-col gap-4 overflow-auto data-table-container px-4 lg:px-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitScrollbar: "none",
        }}
      >
        <div className="overflow-hidden rounded-lg border">
          <div
            className="overflow-auto data-table-scroll"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {solvedProblemsCount} of {table.getFilteredRowModel().rows.length}{" "}
            problem(s) solved.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8 bg-transparent"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8 bg-transparent"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex bg-transparent"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
