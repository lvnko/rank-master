import * as React from "react"
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTranslation } from "react-i18next"
import { UserPayloadType } from "@/types/user"
   
interface DataTableProps<TData extends { recordId: string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    setDataFunc: React.Dispatch<React.SetStateAction<TData[]>>
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    actionHandler: (action: string, options: { id: string, payload?: UserPayloadType | { primName: string } }) => void
}

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        isLoading?: boolean;
        setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
        setDataFunc: React.Dispatch<React.SetStateAction<TData[]>>;
        removeRow: (originalId: string) => void;
        actionHandler: (action: string, options: { id: string, payload?: UserPayloadType | { primName: string } }) => void
    }
}
   
export function DataTable<TData extends { recordId: string }, TValue>({
    columns,
    data,
    setDataFunc,
    isLoading,
    setIsLoading,
    actionHandler
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    // const [isLoading, setIsLoading] = React.useState(false)
    const { t } = useTranslation();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        meta: {
            isLoading,
            setIsLoading,
            setDataFunc,
            actionHandler,
            removeRow: (originalId: string) => {
                setDataFunc((prevData) => prevData.filter((row) => (row as { recordId: string }).recordId !== originalId));
                setIsLoading(false);
            },
        }
    })
   
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                        return (
                            <TableHead key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </TableHead>
                        )
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
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            {t('common.noResult', { ns: 'common' })}
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}