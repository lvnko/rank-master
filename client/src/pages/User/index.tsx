import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLoaderData } from 'react-router-dom';

import type UserType from "@/types/user";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage     } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserFormDataType, UserPageDataType } from "@/types/user";

export default function User() {

    const response: any = useLoaderData();
    // const user: UserType = response?.data?.user || {};
    const userRaw = response?.data?.user || {};
    const user: UserPageDataType = {
        ...userRaw,
        translations: new Map(Object.keys(userRaw.translations).map((key)=>[key, userRaw.translations[key]]))
    };

    useEffect(() => {  
        console.log('response =>', user);
    }, []);

    return (
        <>
            <PageHeader className="justify-start item-center space-x-2">
                <div className="mt-2"><Link to="/users"><ArrowLeftIcon width="34" height="34"/></Link></div>
                <PageHeaderHeading>User Page</PageHeaderHeading>
            </PageHeader>
            <Card>
                {user && (
                    <CardContent>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <p className="text-sm text-foreground/50">Full Name</p>
                                <p className="text-lg">{user.translations.get('en-US')?.firstName} {user.translations.get('en-US')?.lastName}</p>
                            </div>
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={`https://xsgames.co/randomusers/avatar.php?g=${user.gender.toLowerCase() === "m" ? 'male' : 'female'}`}/>
                                <AvatarFallback>{user.translations.get('en-US')?.firstName}</AvatarFallback>
                            </Avatar>
                        </div>
                        <Separator className="my-2"/>
                    </CardContent>
                )}
            </Card>
        </>
    );

}