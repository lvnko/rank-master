import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import useToastPromise from '@/hooks/useToastPromise';
import { useState } from "react";


export default function Surveys() {

    const toastPromise = useToastPromise();
    const [isLoading, setIsLoading] = useState(false);

    const fetcher = async (url: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await fetch(url);
                
                if (result.ok) {
                    const data = await result.json();
                    resolve(data);
                    return;
                }

                throw new Error('Something went wrong.');

            } catch (error) {
                console.error('Reject process: Error :', error);
                reject(error);
            }
        });
    }

    const errorFetcher = () => {
        return fetcher('http://localhost:8081/error');
    }

    const clickHandler = async () => {
        setIsLoading(true);
        toastPromise(errorFetcher, {
            message: 'Success',
            description: 'Success message description.'
        }, (data) => {
            console.log('data =>', data);
            setIsLoading(false);
        });
    }

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Surveys Page</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Testing.</p>
                    <Button
                        className="toast-button"
                        onClick={clickHandler}
                        disabled={isLoading}
                    >
                        Render toast
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}
