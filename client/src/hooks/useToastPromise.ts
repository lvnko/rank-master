import { toast } from 'sonner';

export interface ToastMessage {
    message: string,
    description: string
};

const useToastPromise = () => {

    const toastPromise = async (
        promise: () => Promise<any>,
        successMessage: ToastMessage | ((data: any) => ToastMessage),
        callback?: (data: any) => void
    ) => {

        const toastId = toast.loading('Loading...');

        try {
            const data = await promise();
            toast.dismiss(toastId);
            const successMsg = typeof successMessage === 'function' ? successMessage(data) : successMessage;
            toast.success(
                ...[
                    typeof successMsg === 'string' ?
                        successMsg :
                        successMsg.message,
                    {   
                        id: toastId,
                        ...(
                            typeof successMsg === 'object' && successMsg.description ?
                                { description: successMsg.description } : null
                        )
                    }
                ]
            );

            if (callback) {
                callback(data);
            }

        } catch (error) {

            console.error('Error:', error);
            toast.error('Error', {id: toastId});

            if (callback) {
                callback(error);
            }
        }
        
    };

    return toastPromise;
};

export default useToastPromise;