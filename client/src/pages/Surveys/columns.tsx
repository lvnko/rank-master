
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

const getSortingHeader = (labelKey: string) => {
    return ({ column }: { column: any }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => {
                    console.log('column.getIsSorted() => ', column.getIsSorted());
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
            >
                {headerLabelRetriever(labelKey)}
                { column.getIsSorted() === 'desc' ?
                    (<ArrowDown />) :
                    column.getIsSorted() === 'asc' ?
                        (<ArrowUp />) :
                        (<ArrowUpDown />)
                }
                
            </Button>
        )
    }
}

export const columns: ColumnDef<SurveyTableRow>[] = [
    {
        accessorKey: "title",
        header: () => headerLabelRetriever('survey.column.title')
    },
    {
        accessorKey: "authorName",
        header: () => getSortingHeader('survey.column.authorName')
    },
    {
        accessorKey: "status",
        header: () => getSortingHeader('survey.column.status'),
        cell: (info) => {
            const { t } = useTranslation();
            return t(`survey.valueLabel.status.${info.getValue()}`);
        }
    },
    {
        accessorKey: "minPairAppearance",
        header: () => getSortingHeader('survey.column.minPairAppearance')
    },
    {
        accessorKey: "highestSingleAppearance",
        header: () => getSortingHeader('survey.column.highestSingleAppearance')
    },
    {
        accessorKey: "voteCountEachSurvey",
        header: () => getSortingHeader('survey.column.voteCountEachSurvey')
    },
    {
        accessorKey: "fullfilled",
        header: () => headerLabelRetriever('survey.column.fullfilled')  
    },
    {
        accessorKey: "updatedAt",
        header: () => getSortingHeader('survey.column.updatedAt')
    }
];