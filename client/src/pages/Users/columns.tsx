
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type UserTableRow = {
    recordId: string
    primName: string
    primNameLang: string
    secName: string
    secNameLang: string
    gender: string
    dateOfBirth: Date
    mobileNum: string
    mobileCountryCode: string
    email: string
    status: "active" | "inactive" | "pending" | "suspended" | "deleted"
    subscription: string
    surveysCreated?: number
    surveysParticipated?: number
    updatedAt?: Date
    createdAt?: Date
}

const headerLabelRetriever = (key: string, options: any = {}) : string => {
    const { t } = useTranslation();
    return String(t(key, { ...options })) || "";
}

export const columns: ColumnDef<UserTableRow>[] = [
    {
        accessorKey: "primName",
        header: () => headerLabelRetriever('user.column.primName')
    },
    {
        accessorKey: "secName",
        header: () => headerLabelRetriever('user.column.secName')
    },
    {
        accessorKey: "gender",
        header: () => headerLabelRetriever('user.gender')
    },
    {
        accessorKey: "dayOfBirth",
        header: () => headerLabelRetriever('user.dateOfBirth')
    },
    {
        accessorKey: "mobileCountryCode",
        header: () => headerLabelRetriever('user.countryCode')
    },
    {
        accessorKey: "mobileNum",
        header: () => headerLabelRetriever('user.mobileNum')
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        console.log('column.getIsSorted() => ', column.getIsSorted());
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                >
                    {headerLabelRetriever('user.email')}
                    { column.getIsSorted() === 'desc' ?
                        (<ArrowDown />) :
                        column.getIsSorted() === 'asc' ?
                            (<ArrowUp />) :
                            (<ArrowUpDown />)
                    }
                    
                </Button>
            )
        }
    },
    {
        accessorKey: "status",
        header: () => headerLabelRetriever('user.column.status'),
        cell: (info) => {
            const { t } = useTranslation();
            return t(`user.valueLabel.status.${info.getValue()}`);
        }
    },
    {
        id: 'actions',
        cell: ({ row, table, ...props }) => {
            const user = row.original;
            const meta = table.options.meta;
            const { t, i18n: { language } } = useTranslation();
            const navigate = useNavigate();
            // console.log('meta => ', meta);
            // console.log('row => ', row);
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={meta?.isLoading || false}>
                            <span className="sr-only">{headerLabelRetriever("action.open-menu", { ns: 'common' })}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions", { ns: 'common' })}</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.recordId)}
                        >
                            {t("user.action.copyId")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate(`/user/${user.recordId}?lng=${language}`)}
                        >
                            {t("user.action.viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(`/user/edit/${user.recordId}?lng=${language}`)}
                        >
                            {t("user.action.editProfile")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (meta?.setIsLoading) meta?.setIsLoading(true);
                                // meta?.removeRow(user.recordId);
                                meta?.actionHandler('DELETE', { id: user.recordId, payload: {
                                    primName: user.primName,
                                } });
                            }}
                        >
                            {t("user.action.deleteUser")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];