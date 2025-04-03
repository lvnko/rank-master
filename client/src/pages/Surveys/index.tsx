import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable, TableActionPayloadType } from "@/components/data-table";
import { Link, useNavigate, useLoaderData } from 'react-router-dom';
import { columns, SurveyTableRow } from "./columns";

// import type { UserPayloadType, UserRawType } from "@/types/user"
import { PlusIcon } from "@radix-ui/react-icons";
// import { UserPageDataType } from "@/types/user";
import { composeFullName, covertRawSurveysToTableData } from "@/lib/utils";
import { createSurveyDeleteThenSurveysRetrivalPromise, createUserDeleteThenUsersRetrivalPromise } from "@/loaders";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DataItem } from "@/types/data-response";
import { SurveyPayloadType, SurveyRawType } from "@/types/survey";

export default function Surveys() {

    const response: any = useLoaderData();
    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const navigate = useNavigate();
    
    const surveysRaw: SurveyRawType[] = response?.data?.surveys || [];
    const surveyDataRows: SurveyTableRow[] = covertRawSurveysToTableData(surveysRaw, { language: language});
    
    // const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
    const [tableData, setTableData] = useState<SurveyTableRow[]>([...surveyDataRows]);
    const [isLoading, setIsLoading] = useState(false);

    const handleTableActione = (
        action: string,
        options: {
            id: string;
            payload?: TableActionPayloadType;
        }
    ) => {
        const { id, payload } = options;
        const actionPromise = getActionPromise(action);
        // console.log(action);
        // console.log(id);
        // console.log(payload);
        if (actionPromise) {
            toast.promise(
                actionPromise(...[
                    id,
                    language
                ]),
                {
                    loading: t('loading', { ns: 'common' }),
                    success: (resData) => {
                        // console.log('resData =>', resData);
                        const { message, data } = resData as {
                            message: string,
                            data: DataItem
                        };
                        console.log('data => ', data);
                        // Success Callback
                        const surveyDataRows: SurveyTableRow[] = covertRawSurveysToTableData(data?.surveys || []);
                        setTableData(surveyDataRows);
                        setIsLoading(false);
                        return {
                            message: t(`survey.success.${action.toLowerCase()}.title`) || message || `Success toast has been added`,
                            description: t(`survey.success.${action.toLowerCase()}.description`, { title: payload && 'title' in payload ? payload.title : '' }) || `Success description.`
                        };
                    },
                    error: (error) => {
                        setIsLoading(false);
                        return error instanceof Error ? `${t(error.name)} : ${t(error.message)}` : `Error toast has been added`;
                    },
                }
            );
        } else {
            console.log('Nothing can be done!!!');
        }
    };

    const getActionPromise = (type: string) => {
        switch(type) {
            case "DELETE":
                return createSurveyDeleteThenSurveysRetrivalPromise;
            default:
                return;
        }
    }

    useEffect(() => {  
        console.log('response =>', surveysRaw);
    }, []);

    return (
        <>
            <PageHeader className="flex justify-between">
                <PageHeaderHeading>{t("survey.heading.platformSurveys")}</PageHeaderHeading>
                <Button
                    variant={"outline"} className="px-2 pr-3"
                    disabled={isLoading}
                    onClick={()=>navigate(`/survey/add?lng=${language}`)}
                >
                    <PlusIcon className="!h-[1.2rem] !w-[1.2rem]" />
                    {t("survey.button.addSurvey")}
                </Button>
            </PageHeader>
            <Card>
                {surveysRaw.length > 0 && (
                    <CardContent>
                        <div className="container mx-auto py-10">
                            <DataTable
                                columns={columns}
                                data={tableData} setDataFunc={setTableData}
                                isLoading={isLoading} setIsLoading={setIsLoading}
                                actionHandler={handleTableActione}
                            />
                        </div>
                    </CardContent>
                )}
            </Card>
        </>
    );
}