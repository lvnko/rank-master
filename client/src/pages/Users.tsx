import { useEffect } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoaderData } from 'react-router-dom';
// import { DataResponse } from "@/types/data-response";


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type UserType from "@/types/user"
import type { DataItem, DataResponse } from "@/types/data-response";

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
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`cursor-pointer hover:bg-muted ${selectedUserId === user.id ? "bg-muted" : ""}`}
          >
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            {/* <TableCell>{user.updatedAt}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}



export default function Users() {

    const response: any = useLoaderData();
    const users: UserType[] = response?.data?.users || [];

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
                        <UserTable users={users} onSelectUser={(user) => console.log(user)} selectedUserId={null} />
                    </CardContent>
                )}
            </Card>
        </>
    )
}
