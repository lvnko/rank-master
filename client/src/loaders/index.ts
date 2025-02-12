import { LoaderFunction, LoaderFunctionArgs } from 'react-router-dom';
import { DataResponse } from "@/types/data-response";

export const usersLoader : LoaderFunction = async ():Promise<DataResponse> => {
    const response = await fetch(`http://localhost:8081/user`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users...`);
    }
    const result: DataResponse = await response.json();
    return result;
}

export const userLoader: LoaderFunction = async ({ params }: LoaderFunctionArgs):Promise<DataResponse> => {
  const { id } = params;
  const response = await fetch(`http://localhost:8081/user/${id}/survey`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user...`);
  }
  const result: DataResponse = await response.json();
  return result;
}