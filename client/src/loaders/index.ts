import { LoaderFunction, LoaderFunctionArgs } from 'react-router-dom';
import { ApiFetchPromiseMessage, DataResponse } from "@/types/data-response";
import { UserFormDataType, UserPayloadType } from '@/types/user';
import { useTranslation } from "react-i18next";

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

export const userFormLoader: LoaderFunction = async ({ params }: LoaderFunctionArgs):Promise<DataResponse> => {
  const { id } = params;

  try {

    const userLoaderResponse = await fetch(`http://localhost:8081/user/${id}`);
    const { data, ...userResponse } = await userLoaderResponse.json();
    const countryCodesLoaderResponse = await fetch(`http://localhost:8081/country-codes`);
    const { data: countryCodesData } = await countryCodesLoaderResponse.json();
    const languagesLoaderResponse = await fetch(`http://localhost:8081/languages`);
    const { data: languagesData } = await languagesLoaderResponse.json();

    if (!userLoaderResponse.ok || !countryCodesLoaderResponse.ok || !languagesLoaderResponse.ok)
      throw new Error(`Failed to fetch user...`);

    const result = {
      ...userResponse,
      data: {
        ...data,
        ...countryCodesData,
        ...languagesData
      }
    }
    
    return result;

  } catch(error) {
    throw new Error(`Failed to fetch user...`);
  }
}

interface PromiseOptionsType {
  method: 'PUT' | 'POST' | 'GET' | 'DELETE',
  language: string,
  body?: any
}

function createPromise<T>(url: string, options: PromiseOptionsType): Promise<T> {

  const { method, language, ...alternativeOptions } = options;

  return new Promise(async (resolve, reject)=>{
    try {
      const response = await fetch(url, { // Replace with your API endpoint
        method,
        headers: {
          'Content-Type': 'application/json', // Important: Specify content type
          'Accept-Language': language
        },
        ...(
          alternativeOptions.body ? {
            body: JSON.stringify(alternativeOptions.body) // Convert form data to JSON
          } :
          {}
        )
      });
      if (response.ok) {
        const data = await response.json();
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  })
}

export function createUserUpdatePromise<T> (id: string, body: any, language: string) : Promise<T> {

  return createPromise(`http://localhost:8081/user/${id}`, {
    method: 'PUT',
    language,
    ...(body ? { body } : {})
  });

}

export function createUserDeletePromise<T> (id: string, language: string) : Promise<T> {

  return createPromise(`http://localhost:8081/user/${id}`, {
    method: 'DELETE',
    language
  });

}

export async function userPoster({ body, language } : {
  body: UserFormDataType,
  language: string
}): Promise<({ name: string })> {
  return new Promise(async (resolve, reject)=>{
    try {
      const response = await fetch(`http://localhost:8081/user`, { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Important: Specify content type
          'Accept-Language': language
        },
        body: JSON.stringify(body), // Convert form data to JSON
      });
      if (response) {
        resolve({ name: 'This is success!' });
      }
    } catch (error) {
      reject(error);
    }
  })
}

export async function userUpdater({ id, body, language, successMessage } : {
  id: string,
  body: UserPayloadType,
  language: string,
  successMessage: ApiFetchPromiseMessage
}): Promise<(ApiFetchPromiseMessage)> {
  return new Promise(async (resolve, reject)=>{
    try {
      const response = await fetch(`http://localhost:8081/user/${id}`, { // Replace with your API endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Important: Specify content type
          'Accept-Language': language
        },
        body: JSON.stringify(body), // Convert form data to JSON
      });
      if (response) {
        resolve(successMessage);
      }
    } catch (error) {
      reject(error);
    }
  })
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