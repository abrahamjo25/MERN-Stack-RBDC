"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";

import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  FilePen,
  GripVerticalIcon,
  MoreVerticalIcon,
  ShieldX,
  TrendingUpIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { DeleteUser } from "../users/delete-user";
import Link from "next/link";
import { DeleteRole } from "./delete-role";

export const roleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  permissions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

export const columns: ColumnDef<z.infer<typeof roleSchema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original._id} />,
  },
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
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },

  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(date); // ➜ "Jul 25, 2025"
    },
  },

  {
    id: "actions",
    cell: (info) => {
      const row = info.row;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>
              <Link
                href={`/dashboard/roles/edit?id=${row.original._id}`}
                className="flex items-center gap-2"
              >
                <FilePen className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DeleteRole roleId={row.original._id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function TableCellViewer({ item }: { item: z.infer<typeof roleSchema> }) {
  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.name}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>
            Showing total visitors for the last 6 months
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">Submit</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;
