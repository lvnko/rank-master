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

    // const toastPromise = async <T extends any[]> (
    //     promise: (...args: T) => Promise<any>,
    //     args: T,
    //     successMessage: ToastMessage | ((data: any) => ToastMessage),
    //     callback?: (data: any) => void
    // ) => {

    //     // const toastId = toast.loading('Loading...');

    //     // try {
    //     //     const data = await promise(...args);
    //     //     toast.dismiss(toastId);
    //     //     const successMsg = typeof successMessage === 'function' ? successMessage(data) : successMessage;
    //     //     toast.success(
    //     //         ...[
    //     //             typeof successMsg === 'string' ?
    //     //                 successMsg :
    //     //                 successMsg.message,
    //     //             {   
    //     //                 id: toastId,
    //     //                 ...(
    //     //                     typeof successMsg === 'object' && successMsg.description ?
    //     //                         { description: successMsg.description } : null
    //     //                 )
    //     //             }
    //     //         ]
    //     //     );

    //     //     if (callback) {
    //     //         callback(data);
    //     //     }

    //     // } catch (error) {

    //     //     console.error('Error:', error);
    //     //     toast.error('Error', {id: toastId});

    //     //     if (callback) {
    //     //         callback(error);
    //     //     }
    //     // }

    // };
    const { t } = useTranslation();
    const { labels } = props || {}
    const loadingLabelDefaultValue = labels?.loading || t('loading', { ns: 'common' });
    const successLabelDefaultValue = labels?.success || t('loading', { ns: 'common' });
    const errorLabelDefaultValue = labels?.error || t('loading', { ns: 'common' });

    const toastPromise = <T extends any[]> ({
            promise,
            args,
            loadingMessage = loadingLabelDefaultValue,
            successMessage = successLabelDefaultValue,
            errorMessage = errorLabelDefaultValue,
            callback,
            errorCallback
        }: {
            promise: (...args: T) => Promise<any>,
            args: T,
            loadingMessage: string,
            successMessage: string | ToastMessage | ((data: any) => string | ToastMessage),
            errorMessage: string | ((error: any) => string),
            callback?: (data?: any) => void,
            errorCallback?: (error?: any) => void
    }) => {
        toast.promise(
            promise(...args),
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