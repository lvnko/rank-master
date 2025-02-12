import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { Link, useLoaderData } from 'react-router-dom';

import type UserType from "@/types/user"

interface UserTableProps {
    users: UserType[]
    onSelectUser: (user: UserType) => void
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
                        <TableCell className="py-3">{user.firstName}</TableCell>
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
    const users: UserType[] = response?.data?.users || [];

    const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)

    const handleRowClick = (user: (typeof users)[0]) => {
        console.log('a click on =>', user);
        setSelectedUser(user)
    }

    useEffect(() => {  
        console.log('response =>', users);
    }, []);

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Users Page</PageHeaderHeading>
            </PageHeader>
            <Card>
                {/* <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description.</CardDescription>
                </CardHeader> */}
                {users.length > 0 && (
                    <CardContent>
                        <UserTable users={users} onSelectUser={handleRowClick} selectedUserId={selectedUser?._id || null} />
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
                                    <span className="text-lg">{selectedUser.firstName} {selectedUser.lastName}</span>
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
                                    </>
                                )}
                                
                            </div>
                            <SheetFooter className="items-center space-y-2">
                                <p className="text-sm text-foreground/50 flex-grow mt-2">
                                    <strong>ID:</strong> {selectedUser._id}
                                </p>
                                <Link to={`/user/${selectedUser._id}`}><Button>More ...</Button></Link>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
