
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
import { Link, useNavigate, useNavigation } from "react-router-dom";
import SurveyType from "@/types/survey";
import { PersonIcon } from "@radix-ui/react-icons";

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
        header: ({ column }) => renderSortingHeader(column), // to be sorted header
        cell: (info) => {
            // console.log('info', info);
            // console.log('info > row > original', info.row.original);
            // console.log('info > row', info.row);
            const { i18n: { language } } = useTranslation();
            const navigate = useNavigate();
            const data = info.row.original;
            const { authorName, authorId } = data;
            return (
                <div className="space-y-1">
                    <p className="font-bold">{String(info.getValue() || '')}</p>
                    {authorId ? (
                        <Button
                            variant={'ghost'}
                            className='py-0 px-1 -ml-2 h-auto gap-1 text-foreground/60 font-light'
                            onClick={()=>navigate(`/user/${authorId}?lng=${language}`)}
                        >
                            <PersonIcon />{String(authorName || '')}
                        </Button>
                    ) : (
                        <p>{String(authorName || '')}</p>
                    )}
                </div>
            );
        }
    },
    // {
    //     accessorKey: "authorName",
    //     header: ({ column }) => renderSortingHeader(column) // to be sorted header
    // },
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
            return format(info.getValue() as Date, 'yyyy-MM-dd, HH:MM:SS');
        }
    },
    {
        id: 'actions',
        cell: ({ row, table, ...props }) => {
            const survey = row.original;
            const meta = table.options.meta;
            const { t, i18n: { language } } = useTranslation();
            const navigate = useNavigate();
            // console.log('ROW : survey => ', survey)
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
                            onClick={() => navigator.clipboard.writeText(survey.recordId)}
                        >
                            {t("survey.action.copyId")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate(`/survey/${survey.recordId}?lng=${language}`)}
                        >
                            {t("survey.action.viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(`/survey/edit/${survey.recordId}?lng=${language}`)}
                        >
                            {t("survey.action.editSurvey")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (meta?.setIsLoading) meta?.setIsLoading(true);
                                // meta?.removeRow(user.recordId);
                                meta?.actionHandler('DELETE', { id: survey.recordId, payload: {
                                    title: survey.title,
                                } });
                            }}
                        >
                            {t("survey.action.deleteSurvey")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];