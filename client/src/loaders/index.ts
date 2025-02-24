import { LoaderFunction, LoaderFunctionArgs } from 'react-router-dom';
import { DataResponse } from "@/types/data-response";
import { UserNewDataType } from '@/types/user';

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

export const userPoster = async({ body, language } : {
  body: UserNewDataType,
  language: string
}) => {
  try {
    const response = await fetch(`http://localhost:8081/user`, { // Replace with your API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Important: Specify content type
        'Accept-Language': language
      },
      body: JSON.stringify(body), // Convert form data to JSON
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

export const fetchLanguages = async () => {
  const response = await fetch(`http://localhost:8081/languages`); // Adjust API route
  if (!response.ok) {
    throw new Error(`Failed to fetch languages...`);
  }
  return await response.json(); // Expected: ['en', 'fr', 'es']
}

export const countryCodesLoader: LoaderFunction = async():Promise<DataResponse> => {
  const response = await fetch(`http://localhost:8081/country-codes`); // Adjust API route
  if (!response.ok) {
    throw new Error(`Failed to fetch country codes...`);
  }
  const result: DataResponse = await response.json();
  return result;
}