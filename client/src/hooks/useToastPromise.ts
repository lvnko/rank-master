import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface ToastMessage {
    message: string,
    description: string
};

interface Labels {
    loading?: string;
    success?: string;
    error?: string;
}

const useToastPromise = (props?: { labels?: Labels }) => {

    const { t } = useTranslation();
    const { labels } = props || {}
    const loadingLabelDefaultValue = labels?.loading || t('loading', { ns: 'common' });
    const successLabelDefaultValue = labels?.success || t('success', { ns: 'common' });
    const errorLabelDefaultValue = labels?.error || t('error', { ns: 'common' });

    const toastPromise = <T extends any[]> ({
            promise,
            args,
            loadingMessage = loadingLabelDefaultValue,
            successMessage = successLabelDefaultValue,
            errorMessage = errorLabelDefaultValue,
            callback,
            errorCallback
        }: {
            promise:
                ((id: string | string[], body: any, language: string) => Promise<any>) |
                ((id: string | string[], language: string) => Promise<any>) |
                ((body: any, language: string) => Promise<any>) |
                ((language: string) => Promise<any>),
            args:
                [string | string[], any, string] |
                [string | string[], string] |
                [any, string] |
                [string],
            loadingMessage?: string,
            successMessage?: string | ToastMessage | ((data: any) => string | ToastMessage),
            errorMessage?: string | ((error: any) => string),
            callback?: (data?: any) => void,
            errorCallback?: (error?: any) => void
    }) => {
        toast.promise(
            args.length === 3 ?
                (promise as (id: string | string[], body: any, language: string) => Promise<any>)(args[0], args[1], args[2]) :
                args.length === 2 ?
                    typeof args[0] !== 'string' ?
                    (promise as (body: any, language: string) => Promise<any>)(args[0], args[1]) :
                    (promise as (id: string | string[], language: string) => Promise<any>)(args[0], args[1]) :
                    (promise as (language: string) => Promise<any>)(args[0]),
            {
                loading: loadingMessage,
                success: (resData) => {
                    console.log('resData =>', resData);
                    if (callback) callback(resData);
                    const successMsg = typeof successMessage === 'function' ? successMessage(resData) : String(successMessage);
                    return typeof successMsg === 'object' ? 
                            { message: successMsg.message, description: successMsg.description } :
                            { message: String(successMsg) };
                },
                error: (error) => {
                    console.log('error =>', error);
                    if (errorCallback) errorCallback(error);
                    const errorMsg = typeof errorMessage === 'function' ? errorMessage(error) : errorMessage;
                    return errorMsg;
                },
            }
        );
    };

    return toastPromise;
};

export default useToastPromise;