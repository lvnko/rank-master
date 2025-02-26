import CountryCodeType from "@/types/country-code";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { z } from "zod";
import { cn, extractPrimaryNameLang } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { CaretSortIcon } from "@radix-ui/react-icons";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { ArrowLeftIcon, CheckIcon, Loader2 } from "lucide-react";
import LanguageType from "@/types/languages";
import { userUpdater } from "@/loaders";

const formSchema = z.object({
    primFirstName:
        z.string({
            required_error: "First Name is required"
        }).min(2, {
            message: "First Name must be at least 2 characters.",
        }),
    primLastName:
        z.string({
            required_error: "Last Name is required"
        }).min(1, {
            message: "Last Name must be at least 2 characters.",    
        }),
    primNameLang:
        z.string().min(1, {
            message: "Please select the language of your primary name.",    
        }),
    secFirstName:
        z.string().min(0),
    secLastName:
        z.string().min(0),
    secNameLang:
        z.string().min(0),
    gender:
        z.enum(["M", "F"], {
            required_error: "You need to select a gender.",
        }),
    dateOfBirth:
        z.date(),
    countryCode:
        z.string().min(1, {
            message: "Please select a country code.",
        }),
    mobileNum:
        z.string().min(8, {
            message: "Please provide a valid mobile phone number."
        }),
    email:
        z.string().email({
            message: "Please provide a valid email address."
        }).min(5, {
            message: "Please provide a valid email address."
        })
});

export default function UserEditForm() {

    // const { t, i18n } = useTranslation();
    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const navigate = useNavigate();
    const response: any = useLoaderData();
    const countryCodes: CountryCodeType[] = response?.data?.countryCodes || [];
    const countryCodeValues = countryCodes.map(({name, code})=>{
        return {
            label: `${t(`user.valueLabel.countryCode.${name}`)} +${code}`,
            value: name
        };
    });
    const languageSupportedLib: LanguageType[] = response?.data?.languages || [];
    const languageValues = languageSupportedLib.map(({name, label})=>{
        return {label, value: name};
    })
    const genderValues = [
        { label: t("user.valueLabel.gender.M"), value: "M" },
        { label: t("user.valueLabel.gender.F"), value: "F" },
    ];

    const [isLoading, setIsLoading] = useState(false);
    
        // 1. Define your form.
    type FormShape = z.infer<typeof formSchema>
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        shouldFocusError: false,
        defaultValues: {
            primFirstName: "",
            primLastName: "",
            primNameLang: "",
            secFirstName: "",
            secLastName: "",
            secNameLang: "",
            gender: undefined,
            dateOfBirth: undefined,
            countryCode: "",
            mobileNum: "",
            email: ""
        },
    });

    // 2. Define a submit handler.
    const onSubmit: SubmitHandler<FormShape> = async (data) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log("form values =>", data);
        setIsLoading(true);
        const {
            primFirstName: firstName = '',
            primLastName: lastName = '',
            countryCode: mobileCountryCode = '',
            ...restFields
        } = data as any;
        const body = {
            translations: {
                [language as string]: {
                    firstName, lastName, isPrimary: true
                }
            },
            mobileCountryCode,
            ...restFields
        };
        toast.promise(userUpdater({
            body: body,
            language: language
        }), {
            loading: t('loading', { ns: 'common' }),
            success: (data: { name: string }) => {
                navigate("/users");
                return {
                    message: `${data.name} toast has been added`,
                    description: 'Custom description for the success state',
                };
            },
            error: 'Error',
        });
    }

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`user.heading.edit`)}</PageHeaderHeading>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 self-stretch"></form>
            </Form>
        </div>
    );

}