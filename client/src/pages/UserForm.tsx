import CountryCodeType from "@/types/country-code";
// import { useTranslation } from "react-i18next";
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

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

const formSchema = z.object({
    // gender: z.enum(["M", "F"]),
    // dateOfBrith: z.string().date(),
    // email: z.string().email().min(5),
    // mobileNum: z.string(),
    currLangFirstName: z.string({
        required_error: "First Name is required"
    }).min(2, {
        message: "First Name must be at least 2 characters.",
    }),
    // currLangLastName: z.string().min(2)
})


export default function UserForm() {

    // const { t, i18n } = useTranslation();
    // const { changeLanguage, language } = i18n;

    const response: any = useLoaderData();
    const countryCodes: CountryCodeType[] = response?.data?.countryCodes || [];
    const countryCodeNames: string[] = countryCodes.reduce<string[]>((accm, { name })=>{
        return [...accm, name]
    }, []);

    // let formSchema = formBaseSchema.merge(z.object({
    //     countryCodes: z.enum([countryCodeNames[0], ...countryCodeNames.slice(1)] as [string, ...string[]]),
    // }));

    // 1. Define your form.
    type FormShape = z.infer<typeof formSchema>
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currLangFirstName: "",
        },
    });

    useEffect(()=>{
        console.log("tracking errors =>",form.formState.errors);
    },[form.formState.errors]);
   
    // 2. Define a submit handler.
    const onSubmit: SubmitHandler<FormShape> = (data) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log("form values =>", data);
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <p>User Form</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="currLangFirstName"
                        render={({ field })=>(
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your first name of the current display language.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}