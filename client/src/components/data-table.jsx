import * as React from "react";
import { IconDotsVertical, IconSearch } from "@tabler/icons-react";
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

import { useIsMobile } from "@/hooks/use-mobile";
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

// Create a separate component for the actions dropdown
function ActionsDropdown({ problem }) {
  const { authUser } = useAuthStore();
  const { playlists, isLoading, getAllPlaylists, addProblemToPlaylist } =
    usePlaylistStore();

  const [isPlaylistSelectionOpen, setIsPlaylistSelectionOpen] =
    React.useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState("");

  // Fetch playlists when dialog opens
  React.useEffect(() => {
    if (isPlaylistSelectionOpen && playlists.length === 0) {
      getAllPlaylists();
    }
  }, [isPlaylistSelectionOpen, playlists.length, getAllPlaylists]);

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist || !problem?.id) return;

    try {
      await addProblemToPlaylist(selectedPlaylist, problem.id);
      setIsPlaylistSelectionOpen(false);
      setSelectedPlaylist("");
    } catch (error) {
      console.error("Failed to add problem to playlist:", error);
    }
  };

  const handleDialogClose = (open) => {
    setIsPlaylistSelectionOpen(open);
    if (!open) {
      setSelectedPlaylist("");
    }
  };

  // Filter out invalid playlists to prevent errors
  const validPlaylists = playlists.filter(
    (playlist) => playlist && playlist.id
  );

  return (
    <>
      <DropdownMenu>
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
          <DropdownMenuItem onClick={() => setIsPlaylistSelectionOpen(true)}>
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

      {/* Playlist Selection Dialog */}
      <Dialog open={isPlaylistSelectionOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
            <DialogDescription>
              Choose a playlist to add "{problem?.title || "this problem"}" to.
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
                        <div className="text-sm text-muted-foreground ">
                          {playlist.problems?.length || 0} problems
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <div className="text-sm">You don't have any playlists yet.</div>
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
    </>
  );
}

// Updated Title Cell Component with navigation
function TitleCell({ problem }) {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate(`/problem/${problem.id}`);
  };

  return (
    <Button
      variant="link"
      className="text-foreground w-fit px-0 text-left h-auto font-medium hover:underline"
      onClick={handleTitleClick}
    >
      {problem.title}
    </Button>
  );
}

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <TitleCell problem={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.original.difficulty;
      const getDifficultyStyle = (diff) => {
        switch (diff?.toLowerCase()) {
          case "easy":
            return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
          case "medium":
            return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
          case "hard":
            return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
        }
      };

      return (
        <div className="w-20">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${getDifficultyStyle(
              difficulty
            )}`}
          >
            {difficulty}
          </span>
        </div>
      );
    },
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
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-48">
        {row.original.tags?.slice(0, 2).map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    ),
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
];

export function DataTable({ data: initialData }) {
  const [data, setData] = React.useState(() => initialData);

  // Existing state
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Infinite scroll state
  const [displayedCount, setDisplayedCount] = React.useState(20);
  const [isLoading, setIsLoading] = React.useState(false);

  // New filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [companyFilter, setCompanyFilter] = React.useState("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [tagsFilter, setTagsFilter] = React.useState("all");

  // Get unique values for filters
  const companies = React.useMemo(() => {
    const uniqueCompanies = Array.from(
      new Set(initialData.map((item) => item.company).filter(Boolean))
    );
    return uniqueCompanies.sort();
  }, [initialData]);

  const allTags = React.useMemo(() => {
    const tags = initialData.flatMap((item) => item.tags || []);
    const uniqueTags = Array.from(new Set(tags));
    return uniqueTags.sort();
  }, [initialData]);

  // Apply custom filters to data and limit displayed count
  const filteredData = React.useMemo(() => {
    const filtered = data.filter((item) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Company filter
      const matchesCompany =
        companyFilter === "all" || item.company === companyFilter;

      // Difficulty filter
      const matchesDifficulty =
        difficultyFilter === "all" ||
        item.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

      // Tags filter
      const matchesTags =
        tagsFilter === "all" || (item.tags && item.tags.includes(tagsFilter));

      return (
        matchesSearch && matchesCompany && matchesDifficulty && matchesTags
      );
    });

    return filtered.slice(0, displayedCount);
  }, [
    data,
    searchTerm,
    companyFilter,
    difficultyFilter,
    tagsFilter,
    displayedCount,
  ]);

  // Get total filtered count for comparison
  const totalFilteredCount = React.useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

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
    }).length;
  }, [data, searchTerm, companyFilter, difficultyFilter, tagsFilter]);

  // Infinite scroll functionality
  const loadMoreRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !isLoading &&
          displayedCount < totalFilteredCount
        ) {
          setIsLoading(true);
          // Simulate loading delay
          setTimeout(() => {
            setDisplayedCount((prev) =>
              Math.min(prev + 20, totalFilteredCount)
            );
            setIsLoading(false);
          }, 500);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isLoading, displayedCount, totalFilteredCount]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

  // Clear all filters and reset displayed count
  const clearFilters = () => {
    setSearchTerm("");
    setCompanyFilter("all");
    setDifficultyFilter("all");
    setTagsFilter("all");
    setDisplayedCount(20);
  };

  // Reset displayed count when filters change
  React.useEffect(() => {
    setDisplayedCount(20);
  }, [searchTerm, companyFilter, difficultyFilter, tagsFilter]);

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

            {(searchTerm ||
              companyFilter !== "all" ||
              difficultyFilter !== "all" ||
              tagsFilter !== "all") && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter summary */}
        {(searchTerm ||
          companyFilter !== "all" ||
          difficultyFilter !== "all" ||
          tagsFilter !== "all") && (
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
            <span>({totalFilteredCount} total results)</span>
          </div>
        )}
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
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

        {/* Loading indicator and load more trigger */}
        {displayedCount < totalFilteredCount && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center py-8"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading more problems...</span>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Showing {displayedCount} of {totalFilteredCount} results
              </div>
            )}
          </div>
        )}

        {displayedCount >= totalFilteredCount && totalFilteredCount > 20 && (
          <div className="flex items-center justify-center py-4">
            <div className="text-muted-foreground text-sm">
              All {totalFilteredCount} results loaded
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
