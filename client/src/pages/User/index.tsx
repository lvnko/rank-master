import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

import type UserType from "@/types/user";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage     } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserFormDataType, UserPageDataType } from "@/types/user";
import { Button } from "@/components/ui/button";

export default function User() {

    const response: any = useLoaderData();
    const navigate = useNavigate();
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
                <div className="mt-2">
                    <Button
                        variant={'ghost'}
                        className={"py-1.5 px-3 -ml-3"}
                        onClick={(e)=>{
                            e.preventDefault();
                            navigate(-1);
                        }}
                    >
                        <ArrowLeftIcon width="46" height="46"/>
                    </Button>
                </div>
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