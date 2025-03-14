import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { Link, useNavigate, useLoaderData } from 'react-router-dom';
import { columns, UserTableRow } from "./columns";

import type UserType from "@/types/user"
import type { UserPayloadType, UserRawType } from "@/types/user"
import { PlusIcon } from "@radix-ui/react-icons";
import { UserPageDataType } from "@/types/user";
import { composeFullName, covertRawUsersToTableData } from "@/lib/utils";
import { createUserDeletePromise } from "@/loaders";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface UserTableProps {
    users: UserPageDataType[]
    onSelectUser: (user: UserPageDataType) => void
    selectedUserId: string | null
}

function UserTable({ users, onSelectUser, selectedUserId }: UserTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                        className={`cursor-pointer hover:bg-muted ${selectedUserId === user._id ? "bg-muted" : ""}`}
                    >
                        <TableCell className="py-3">{user.translations.get("en-US")?.firstName} {user.translations.get("en-US")?.lastName}</TableCell>
                        <TableCell className="py-3">{user.email}</TableCell>
                        <TableCell className="py-3">{user.role}</TableCell>
                        <TableCell className="py-3">{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function Users() {

    const response: any = useLoaderData();
    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const navigate = useNavigate();
    // const users: UserType[] = response?.data?.users || [];
    const usersRaw = response?.data?.users || [];

    const users: UserPageDataType[] = usersRaw.map((userRaw: UserRawType) => {
        return {
            ...userRaw,
            translations: new Map(Object.keys(userRaw.translations).map((key) => [key, userRaw.translations[key]]))
        };
    });

    const userDataRows: UserTableRow[] = covertRawUsersToTableData(usersRaw);

    const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
    const [tableData, setTableData] = useState<UserTableRow[]>([...userDataRows]);
    const [isLoading, setIsLoading] = useState(false);

    const handleTableActione = (args: {
        action: string;
        id: string;
        payload?: UserPayloadType;
        language: string;
    }) => {
        const actionPromise = getActionPromise(action);
        toast.promise(
            createUserUpdatePromise(args.id, args.payload, args.language),
            {
                loading: t('loading', { ns: 'common' }),
                success: (resData) => {
                    console.log('resData =>', resData);
                    const { message, data: { user } } = resData as {
                        message: string,
                        data: {
                            user: any
                        }
                    };
                    const { firstName, lastName } = user.translations[language || 'en-US'];
                    const userFullName = composeFullName({firstName, lastName, language});
                    setIsLoading(false);
                    navigate("/users");
                    return {
                        message: t('user.success.update.title') || message || `Success toast has been added`,
                        description: t('user.success.update.description', { fullName: userFullName }) || `Success description.`
                    };
                },
                error: (error) => {
                    console.log('error =>', error);
                    setIsLoading(false);
                    return `Error toast has been added`;
                },
            }
        );
    };

    const handleRowClick = (user: (typeof users)[0]) => {
        console.log('a click on =>', user);
        setSelectedUser(user)
    }

    const getActionPromise = (type: string) => {
        switch(type) {
            case "DELETE":
            default:
                return createUserDeletePromise;
                break;
        }
    }

    useEffect(() => {  
        console.log('response =>', users);
    }, []);

    return (
        <>
            <PageHeader className="flex justify-between">
                <PageHeaderHeading>Users Page</PageHeaderHeading>
                <Button
                    variant={"ghost"} className="w-9 px-0"
                    disabled={isLoading}
                    onClick={()=>navigate("/user/add")}
                >
                    <PlusIcon className="!h-[1.2rem] !w-[1.2rem]" />
                </Button>
            </PageHeader>
            <Card>
                {/* <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description.</CardDescription>
                </CardHeader> */}
                {users.length > 0 && (
                    <CardContent>
                        {/* <UserTable users={users} onSelectUser={handleRowClick} selectedUserId={selectedUser?._id || null} /> */}
                        <div className="container mx-auto py-10">
                            <DataTable
                                columns={columns}
                                data={tableData} setDataFunc={setTableData}
                                isLoading={isLoading} setIsLoading={setIsLoading}
                            />
                        </div>
                    </CardContent>
                )}
            </Card>
            <Sheet open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>User Details</SheetTitle>
                        <SheetDescription>Detailed information about the selected user.</SheetDescription>
                    </SheetHeader>
                    {selectedUser && (
                        <>
                            <div className="mt-4 space-y-4">
                                <p>
                                    <strong>Full Name:</strong>
                                    <br/>
                                    <span className="text-lg">{selectedUser.translations.get("en-US")?.firstName} {selectedUser.translations.get("en-US")?.lastName}</span>
                                </p>
                                <p>
                                    <strong>Email:</strong>
                                    <br/>
                                    {selectedUser.email}
                                </p>
                                <p>
                                    <strong>Mobile Number:</strong>
                                    <br/>
                                    {selectedUser.mobileCountryCode && (
                                        <>+ {selectedUser.mobileCountryCode}</>
                                    )} {selectedUser.mobileNum}
                                </p>
                                <Separator className="my-4" />
                                <div className="flex items-center h-12">
                                    <div className="flex flex-grow basis-1/2 flex-col items-center space-y-2">
                                        <p>
                                            <strong>Role:</strong>
                                        </p>
                                        <p className="text-lg">{selectedUser.role}</p>
                                    </div>
                                    <Separator orientation="vertical" />
                                    <div className="flex flex-grow basis-1/2 flex-col items-center space-y-2">
                                        <p>
                                            <strong>Subscription:</strong>
                                        </p>
                                        <p className="text-lg">{selectedUser.subscription}</p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                {(
                                    (selectedUser.surveysCreated && selectedUser.surveysCreated > 0) ||
                                    (selectedUser.surveysParticipated && selectedUser.surveysParticipated > 0)
                                ) && (
                                    <>
                                        <div className="flex items-center h-12">
                                            {selectedUser.surveysCreated && selectedUser.surveysCreated > 0 && (
                                                <div className="flex flex-grow basis-1/2 flex-col items-center space-y-2">
                                                    <p>
                                                        <strong>Surveys Created:</strong>
                                                    </p>
                                                    <p className="text-lg">{selectedUser.surveysCreated}</p>
                                                </div>
                                            )}
                                            {(
                                                (selectedUser.surveysParticipated && selectedUser.surveysParticipated > 0) ||
                                                (selectedUser.surveysParticipated && selectedUser.surveysParticipated > 0)
                                            ) && (
                                                <Separator orientation="vertical" />
                                            )}
                                            {selectedUser.surveysParticipated && selectedUser.surveysParticipated > 0 && (
                                                <div className="flex flex-grow basis-1/2 flex-col items-center space-y-2">
                                                    <p>
                                                        <strong>Surveys Participated:</strong>
                                                    </p>
                                                    <p className="text-lg">{selectedUser.surveysParticipated}</p>
                                                </div>
                                            )}
                                        </div>
                                        <Separator className="my-4" />
                                        <p className="text-sm text-foreground/50 flex-grow mt-2">
                                            <strong>ID:</strong> {selectedUser._id}
                                        </p>
                                        <Separator className="my-4" />
                                    </>
                                )}
                                
                            </div>
                            <SheetFooter className="flex items-center py-2">
                                <Link to={`/user/edit/${selectedUser._id}`}>
                                    <Button>Edit</Button>
                                </Link>
                                <Link to={`/user/${selectedUser._id}`}>
                                    <Button>More ...</Button>
                                </Link>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
