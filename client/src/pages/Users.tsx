import { useEffect } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoaderData } from 'react-router-dom';
// import { DataResponse } from "@/types/data-response";

export default function Users() {

    const response = useLoaderData();

    useEffect(() => {  
        console.log('response =>', response);
    }, []);

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Users Page</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description.</CardDescription>
                </CardHeader>
            </Card>
        </>
    )
}
