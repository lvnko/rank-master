import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useLoaderData } from 'react-router-dom';

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
            <TableHead>Name</TableHead>
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
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
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
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description.</CardDescription>
                </CardHeader>
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
                    <div className="mt-4 space-y-4">
                    <p>
                        <strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p>
                        <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                        <strong>Role:</strong> {selectedUser.role}
                    </p>
                    <p>
                        <strong>ID:</strong> {selectedUser._id}
                    </p>
                    </div>
                )}
                </SheetContent>
            </Sheet>
        </>
    )
}
