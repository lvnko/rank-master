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
import { createUserDeleteThenUsersRetrivalPromise } from "@/loaders";
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
    const surveyDataRows: SurveyTableRow[] = covertRawSurveysToTableData(surveysRaw);
    
    // const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
    const [tableData, setTableData] = useState<SurveyTableRow[]>([...surveyDataRows]);
    const [isLoading, setIsLoading] = useState(false);

    const handleTableActione = (action: string, options: {
        id: string;
        payload?: TableActionPayloadType;
    }) => {
        const { id, payload } = options;
        console.log(action);
        console.log(id);
        console.log(payload);
    };

    useEffect(() => {  
        console.log('response =>', surveysRaw);
    }, []);

    return (
        <>
            <PageHeader className="flex justify-between">
                <PageHeaderHeading>{t("user.heading.platformUsers")}</PageHeaderHeading>
                <Button
                    variant={"outline"} className="px-2"
                    disabled={isLoading}
                    onClick={()=>navigate(`/user/add?lng=${language}`)}
                >
                    <PlusIcon className="!h-[1.2rem] !w-[1.2rem]" />
                    {t("user.button.addUser")}
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