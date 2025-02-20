import CountryCodeType from "@/types/country-code";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

/**
 interface UserTranslationType {
     _id: string;
     firstName: string;
     lastName: string;
 }
 
 export default interface UserType {
     _id: string;
     translations: { [key: string]: UserTranslationType }
     gender: string;
     dateOfBrith: Date;
     email: string;
     mobileNum: string;
     mobileCountryCode: string;
     role: string;
     subscription: string;
     updatedAt: Date;
     createdAt: Date;
     surveys?: Array<SurveyType>;
     participations?: Array<ParticipationProgressType>;
     surveysCreated?: number;
     surveysParticipated?: number;
 };
 */

const formBaseSchema = z.object({
    username: z.string().min(2).max(50),
    gender: z.enum(["M", "F"]),
    dateOfBrith: z.string().date(),
    email: z.string().email(),
    mobileNum: z.string(),
    // mobileCountryCode: ,
    translations: z.object({})
})


export default function UserForm() {

    const { t, i18n } = useTranslation();
    const { changeLanguage, language } = i18n;

    const response: any = useLoaderData();
    const countryCodes: CountryCodeType[] = response?.data?.countryCodes || [];
    const countryNames: string[] = countryCodes.reduce<string[]>((accm, { name })=>{
        return [...accm, name]
    }, []);
    
    let userNameSchema = z.object({
        [language]: z.object({
            firstName: z.string().min(2, {
                message: "First name must be at least 2 characters.",
            }),
            lastName: z.string().min(1, {
                message: "Last name must be at least 2 characters.",
            })
        })
    });

    let formSchema = formBaseSchema.merge(z.object({
        countryCodes: z.enum([countryNames[0], ...countryNames.slice(1)] as [string, ...string[]]),
        translations: userNameSchema
    }));

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
      },
    })
   
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
    }

    return (
        <div className="flex justify-center items-center">
            <p>User Form</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                </form>
                <Button type="submit">Submit</Button>
            </Form>
        </div>
    );
}