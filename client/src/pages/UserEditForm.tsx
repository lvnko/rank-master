import CountryCodeType from "@/types/country-code";
import LanguageType from "@/types/languages";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { z } from "zod";
import { cn, extractPrimaryNameLang, extractUserFormData } from "@/lib/utils";
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
import { DateTimePickerRenderer, RadioGroupRenderer, SelectFieldRenderer } from "@/components/form-item-renderer";
import FormSectionHeading from "@/components/form-section-heading";

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
        z.string().optional(),
    secLastName:
        z.string().optional(),
    secNameLang:
        z.string().optional(),
    gender:
        z.string().min(1, {
            message: "You need to select a gender.",
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

    const formDefaultValues = extractUserFormData(response);

        // 1. Define your form.
    type FormShape = z.infer<typeof formSchema>
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        shouldFocusError: false,
        defaultValues: {
            ...formDefaultValues
        },
    });

    // 2. Define a submit handler.
    const onSubmit: SubmitHandler<FormShape> = async (data) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log("form isDirty?", form?.formState?.isDirty);
        console.log("form dirtyFields => ", form?.formState?.dirtyFields);
        console.log("form values =>", data);

        if (form?.formState?.isDirty && Object.keys(form?.formState?.dirtyFields).length > 0) {
            setIsLoading(true);
            let payloadCollection: {
                translations?: Record<string, { firstName: string, lastName: string, isPrimary: boolean }>,
                gender? : string,
                dateOfBirth?: Date,
                mobileCountryCode? : string,
                mobileNum?: string,
                email? : string
            } = {};
            const dirtyFields = form.formState.dirtyFields;
            const isPrimNameDirty = ["primFirstName", "primLastName", "primNameLang"].reduce((accm, curr) => {
                return accm + (dirtyFields[curr as keyof typeof dirtyFields] !== undefined ? 1 : 0);
            }, 0) > 0;
            const isSecNameDirty = ["secFirstName", "secLastName", "secNameLang"].reduce((accm, curr) => {
                return accm + (dirtyFields[curr as keyof typeof dirtyFields] !== undefined ? 1 : 0);
            }, 0) > 0;
            if (isPrimNameDirty || isSecNameDirty) {
                payloadCollection = {
                    ...payloadCollection,
                    translations: {
                        ...(isPrimNameDirty? {
                            [data.primNameLang]: {
                                firstName: data.primFirstName,
                                lastName: data.primLastName,
                                isPrimary: true
                            }
                        } : null),
                        ...(isSecNameDirty && data.secNameLang ? {
                            [data.secNameLang]: {
                                firstName: data.secFirstName || '',
                                lastName: data.secLastName || '',
                                isPrimary: false
                            }
                        } : null)
                    }
                }
            }
        }

        // const {
        //     primFirstName: firstName = '',
        //     primLastName: lastName = '',
        //     countryCode: mobileCountryCode = '',
        //     ...restFields
        // } = data as any;
        // const body = {
        //     translations: {
        //         [language as string]: {
        //             firstName, lastName, isPrimary: true
        //         }
        //     },
        //     mobileCountryCode,
        //     ...restFields
        // };
        // toast.promise(userUpdater({
        //     body: body,
        //     language: language
        // }), {
        //     loading: t('loading', { ns: 'common' }),
        //     success: (data: { name: string }) => {
        //         navigate("/users");
        //         return {
        //             message: `${data.name} toast has been added`,
        //             description: 'Custom description for the success state',
        //         };
        //     },
        //     error: 'Error',
        // });
    }
    

    useEffect(()=>{
        const userData = response?.data?.user || {};
        if (Object.keys(userData).length > 0) {
            // console.log("form => ", form);
            // console.log("formSchema => ", formSchema);
            const { formState:  { defaultValues = {} } } = form;
            if (Object.keys(defaultValues).length > 0) {
               Object.keys(defaultValues).forEach((key) => {
                const typedKey = key as keyof typeof defaultValues;
                if (defaultValues[typedKey] !== undefined) {
                    form.setValue(typedKey, defaultValues[typedKey]);
                }
               });
            }
        }
    }, [form.setValue]);

    useEffect(()=>{
        console.log("tracking errors =>",form.formState.errors);
    },[form.formState.errors]);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`user.heading.edit`)}</PageHeaderHeading>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 self-stretch">
                    <Separator />
                    <FormSectionHeading>{t('user.heading.primName')}</FormSectionHeading>
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
                    <FormSectionHeading>{t('user.heading.personal')}</FormSectionHeading>
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
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={DateTimePickerRenderer({
                                initFieldValueState: new Date(response?.data?.user?.dateOfBirth),
                                name: "dateOfBirth",
                                label: t('user.dateOfBirth'),
                                className: "space-y-3 basis-1/2",
                                disabled: isLoading
                            })}
                        />
                    </div>
                    <Separator />
                    <h3 className="!scroll-m-8 text-xl font-semibold tracking-tight underline underline-offset-4 text-blue-500">Contact Info</h3>
                    <div className="flex items-start gap-x-[1.25rem]">
                        <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field })=>(
                                <FormItem className="flex flex-col basis-1/5">
                                    <div>
                                        <FormLabel className="!inline">{t("user.countryCode")}</FormLabel>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger className="w-full" asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    disabled={isLoading}
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? countryCodeValues.find(
                                                            (code) => code.value === field.value
                                                        )?.label
                                                        : t("user.placeholder.countryCode")}
                                                    <CaretSortIcon className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search country code..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No country code found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {countryCodeValues.map((code) => (
                                                            <CommandItem
                                                                value={code.label}
                                                                key={code.value}
                                                                onSelect={() => {
                                                                    form.setValue("countryCode", code.value)
                                                                }}
                                                            >
                                                                {code.label}
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        code.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>{t("user.description.countryCode")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mobileNum"
                            render={({ field })=>(
                                <FormItem className="basis-2/5">
                                    <FormLabel>{t("user.mobileNum")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("user.placeholder.mobileNum")}
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{t("user.description.mobileNum")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field })=>(
                                <FormItem className="basis-2/5">
                                    <FormLabel>{t("user.email")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("user.placeholder.email")}
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{t("user.description.email")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-between">
                        <Link to="/users">
                            <Button variant="outline" disabled={isLoading}><ArrowLeftIcon />Back</Button>
                        </Link>
                        <Button type="submit" disabled={!form.formState.isDirty || isLoading}>
                            {isLoading && (<Loader2 className="animate-spin" />)}
                            {t(isLoading ? 'loading' : 'button.submit', { ns: 'common' })}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );

}