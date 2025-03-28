import { LoaderFunction, LoaderFunctionArgs } from 'react-router-dom';
import { ApiFetchPromiseMessage, DataItem, DataResponse } from "@/types/data-response";
import { UserFormDataType, UserPayloadType } from '@/types/user';
import { error } from 'console';

interface PromiseOptionsType {
  method: 'PUT' | 'POST' | 'GET' | 'DELETE';
  language: string;
  body?: any;
  validationErrorBook?: (type?:string) => Error;
}

function createPromise<T>(url: string, options: PromiseOptionsType): Promise<T> {

  const {
    method,
    language = 'en-US',
    validationErrorBook = () => {
      const error = new Error('generic.error.description');
      error.name = 'generic.error.opening';
      return error;
    },
    ...alternativeOptions
  } = options;

  return new Promise(async (resolve, reject)=>{
    console.log('Promise to fetch url : ', url);
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
      } else {
        console.log('not ok ... ', response);
        const responseJSON = await response.json();
        // console.log('response.json() ... ', responseJSON.error || 'NA');
        if (responseJSON.error) {
          const errorToThrow = new Error(responseJSON.error.message? responseJSON.error?.message : 'generic.error.description');
          errorToThrow.name = responseJSON.error.code? `generic.error.${responseJSON.error.code}` : 'generic.error.opening';
          throw errorToThrow; // If the API response is not ok, the promise will reject
        } else throw validationErrorBook();
      }
    } catch (error) {
      // if (error instanceof Error) console.log('error @base Promise  => ', error.message);
      reject(error);
    }
  })
}

export const usersLoader : LoaderFunction = async ({ request }):Promise<DataResponse> => {
  const url = new URL(request.url);
  const language = url.searchParams.get("lng") || 'en-US';
  try {
    const response = await createPromise<DataResponse>(`http://localhost:8081/user`, {
      method: 'GET',
      language
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const userFormLoader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs):Promise<DataResponse> => {
  const { id } = params;
  const url = new URL(request.url);
  const language = url.searchParams.get("lng") || 'en-US';
  const promiseOptions: PromiseOptionsType = { method: 'GET', language };

  try {

    const userLoaderResponse = await createPromise<DataResponse>(`http://localhost:8081/user/${id}`, promiseOptions);
    const countryCodesLoaderResponse = await createPromise<DataResponse>(`http://localhost:8081/country-codes`, promiseOptions);
    const languagesLoaderResponse = await createPromise<DataResponse>(`http://localhost:8081/languages`, promiseOptions);

    if (
      userLoaderResponse?.statusText !== 'success' ||
      countryCodesLoaderResponse?.statusText !== 'success' ||
      languagesLoaderResponse?.statusText !== 'success'
    )
      throw new Error(`Failed to fetch user...`);

    const { data, ...userResponse } = userLoaderResponse;
    const { data: countryCodesData } = countryCodesLoaderResponse;
    const { data: languagesData } = languagesLoaderResponse;

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
    console.log('error at userFormLoader => ', error);
    throw new Error(`Failed to fetch user...`);
  }
}

export const userLoader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs):Promise<DataResponse> => {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const language = url.searchParams.get("lng") || 'en-US';
    const promiseOptions: PromiseOptionsType = { method: 'GET', language };
    const response = await createPromise<DataResponse>(`http://localhost:8081/user/${id}/survey`, promiseOptions);
    if (response?.statusText !== 'success') {
      throw new Error(`Failed to fetch user...`);
    }
    return response;
  } catch (error) {
    console.log('UserLoader error => ', error);
    throw new Error(`Failed to fetch user...`);
  }
}

export const SurveysLoader: LoaderFunction = async ({ request }: LoaderFunctionArgs):Promise<DataResponse> => {

  try {
    const url = new URL(request.url);
    const language = url.searchParams.get("lng") || 'en-US';
    const promiseOptions: PromiseOptionsType = { method: 'GET', language };
    const response = await createPromise<DataResponse>(`http://localhost:8081/survey`, promiseOptions);
    if (response?.statusText !== 'success') {
      throw new Error(`Failed to fetch survey...`);
    }
    return response;
  } catch (error) {
    console.log('SurveysLoader error => ', error);
    throw new Error(`Failed to fetch survey...`);
  }
}

export function createUsersRetrievalPromise<T> (language: string) : Promise<T> {
  
  return createPromise(`http://localhost:8081/user`, {
    method: 'GET',
    language
  });

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

export function createUserDeleteThenUsersRetrivalPromise<T> (id: string, language: string) : Promise<T> {

  interface ResponseType {
    message?: string | string[]
    data?: DataItem
  }
  
  return new Promise(async (resolve, reject) => {

    let result = {};
    
    try {
      
      const report: Response = await createUserDeletePromise(id, language);

      if ([200, 204].indexOf(report.status) > -1 || report.statusText === 'success') {
        result = {
          ...report as ResponseType
        };
      } else {
        reject(new Error('user.fail.delete')); // If the deletion failed, the promise will reject}
      }

      const response: Response = await createUsersRetrievalPromise(language);

      if ([200, 204].indexOf(response.status) > -1 || response.statusText === 'success') {
        const { message = '', data: resultContent = {} } = result as ResponseType;
        const { message: responseMessage = '', data: responseContent = {} }  = response as ResponseType;
        result = {
          message: message !== '' ? [message, responseMessage] : responseMessage,
          data: { 
            ...resultContent,
            ...responseContent
          }
        };
        resolve(result as T);
      } else {
        reject(new Error('user.fail.get.plural')); // If the retrival of users list is failed, the promise will reject}
      }
    } catch (error) {
      reject(error);
    }

  });

}

export async function createUserInsertionPromise<T> (body: any, language: string) : Promise<T> {

  return createPromise(`http://localhost:8081/user`, {
    method: 'POST',
    language,
    body
  });

}

export async function createSurveyInsertionPromise<T> (id: string, body: any, language: string) : Promise<T> {

  return createPromise(`http://localhost:8081/user/${id}/survey`, {
    method: 'POST',
    language,
    body
  });

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