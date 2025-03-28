
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
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import SurveyType from "@/types/survey";

export type SurveyTableRow = Pick<
    SurveyType,
    'status' | 'fullfilled' | 'minPairAppearance' | 'highestSingleAppearance' | 'voteCountEachSurvey'
> & {
    recordId: string;
    title: string;
    authorName: string;
    authorId: string;
    updatedAt?: Date;
    createdAt?: Date;
};

const headerLabelRetriever = (key: string, options: any = {}) : string => {
    const { t } = useTranslation();
    return String(t(key, { ...options })) || "";
};

const renderSortingHeader = (column: any) => {
    return (
        <Button
            variant="ghost"
            className={'px-3 -ml-3'}
            onClick={() => {
                console.log('column.getIsSorted() => ', column.getIsSorted());
                column.toggleSorting(column.getIsSorted() === "asc");
            }}
        >
            {headerLabelRetriever(`survey.column.${column.id}`)}
            { column.getIsSorted() === 'desc' ?
                (<ArrowDown />) :
                column.getIsSorted() === 'asc' ?
                    (<ArrowUp />) :
                    (<ArrowUpDown />)
            }
            
        </Button>
    );
}

export const columns: ColumnDef<SurveyTableRow>[] = [
    {
        accessorKey: "title",
        header: () => headerLabelRetriever('survey.column.title'),
        cell: (info) => {
            console.log(info);
            return 'title';
        }
    },
    {
        accessorKey: "authorName",
        header: ({ column }) => renderSortingHeader(column) // to be sorted header
    },
    {
        accessorKey: "status",
        header: ({ column }) => renderSortingHeader(column), // to be sorted header
        cell: (info) => {
            const { t } = useTranslation();
            return t(`survey.valueLabel.status.${info.getValue()}`);
        }
    },
    {
        accessorKey: "minPairAppearance",
        header: ({ column }) => renderSortingHeader(column) // to be sorted header
    },
    {
        accessorKey: "highestSingleAppearance",
        header: ({ column }) => renderSortingHeader(column) // to be sorted header
    },
    {
        accessorKey: "voteCountEachSurvey",
        header: ({ column }) => renderSortingHeader(column)
    },
    {
        accessorKey: "fullfilled",
        header: () => headerLabelRetriever('survey.column.fullfilled')  
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => renderSortingHeader(column), // to be sorted header
        cell: (info) => {
            return format(info.getValue() as Date, 'yyyy-MM-dd');
        }
    }
];