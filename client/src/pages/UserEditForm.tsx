import CountryCodeType from "@/types/country-code";
import LanguageType from "@/types/languages";
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

import { userUpdater } from "@/loaders";
import { Separator } from "@/components/ui/separator";
import { RadioGroupRenderer, SelectFieldRenderer } from "@/components/form-item-renderer";

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
    

    useEffect(()=>{
        const userData = response?.data?.user || {};
        if (Object.keys(userData).length > 0) {
            const {
                translations,
                gender,
                dateOfBirth,
                email,
                mobileNum,
                mobileCountryCode
            } = userData;
            const primNameLang = extractPrimaryNameLang(translations);
            const {
                firstName: primFirstName,
                lastName: primLastName,
            } = translations[primNameLang] || {
                firstName: "",
                lastName: "",
            };
            form.setValue("primFirstName", primFirstName);
            form.setValue("primLastName", primLastName);
            form.setValue("primNameLang", primNameLang);
            form.setValue("gender", gender);
            form.setValue("dateOfBirth", new Date(dateOfBirth));
            form.setValue("mobileNum", mobileNum);
            form.setValue("countryCode", countryCodes.filter(({ code }) => code === mobileCountryCode)[0].name || "");
            form.setValue("email", email);

        }
    }, [form.setValue]);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`user.heading.edit`)}</PageHeaderHeading>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 self-stretch">
                    <Separator />
                    <h3 className="!scroll-m-8 text-xl font-semibold tracking-tight underline underline-offset-4 text-blue-500">Primary Name</h3>
                    <div className={`flex items-start gap-x-[1.25rem] !mt-4`}>
                        <FormField
                            control={form.control}
                            name="primNameLang"
                            render={SelectFieldRenderer({
                                initFieldValueState: response?.data?.user?.translations ?
                                    extractPrimaryNameLang(response.data.user.translations) :
                                    language,
                                name: "primNameLang",
                                label: "Language",
                                description: "Language of primary name.",
                                placeholder: "Select Language",
                                className: "basis-1/5",
                                optionValues: languageValues,
                                disabled: isLoading
                            })}
                        />
                        <div className={`flex items-start gap-x-[1.25rem] basis-4/5 ${['zh-TW'].indexOf(language) >= 0 ? " flex-row-reverse":""}`}>
                            <FormField
                                control={form.control}
                                name="primFirstName"
                                render={({ field })=>(
                                    <FormItem className={"flex-grow"}>
                                        <FormLabel>{t("user.firstName")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t("generic.name.first")}
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>{t("user.description.firstName")}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="primLastName"
                                render={({ field })=>(
                                    <FormItem className={"flex-grow"}>
                                        <FormLabel>{t("user.lastName")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t("generic.name.last")}
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>{t("user.description.lastName")}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-x-[1.25rem]">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={RadioGroupRenderer({
                                initFieldValueState: response?.data?.user?.gender || '',
                                name: 'gender',
                                label: t('user.gender'),
                                optionValues: genderValues,
                                className: "space-y-3 basis-1/2",
                                disabled: isLoading
                            })}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );

}