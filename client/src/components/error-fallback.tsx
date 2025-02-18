import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';

export default function ErrorFallback() {

  const { t, i18n } = useTranslation();
  const { changeLanguage, language } = i18n;
  const error = useRouteError();
  let errorMessage: string;

    useEffect(()=> {
      console.log('i18n => ', i18n);
      console.log('i18n => ', changeLanguage);
      console.log('i18n => ', language);
    }, []);
  
    if (isRouteErrorResponse(error)) {
      // error is type `ErrorResponse`
      errorMessage = error.statusText || error.data?.message || 'Unknown error';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      console.error(error);
      errorMessage = 'Unknown error';
    }

    return (
        <div id='error-page' className='flex flex-grow flex-col gap-8 justify-center items-center'>
            <h1 className='text-4xl font-bold'>{t('generic.error.opening')}</h1>
            <p>{t('generic.error.description')}</p>
            <p className='text-slate-400'>
                <i>{errorMessage}</i>
            </p>
        </div>
    )
}