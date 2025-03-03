import CountryCodeType from "@/types/country-code";
import LanguageType from "@/types/languages";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
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
import { CaretSortIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { ArrowLeftIcon, ArrowUpDown, CheckIcon, DeleteIcon, Loader2, Trash2Icon } from "lucide-react";

import { userUpdater } from "@/loaders";
import { Separator } from "@/components/ui/separator";
import { DateTimePickerRenderer, RadioGroupRenderer, SelectFieldRenderer } from "@/components/form-item-renderer";
import FormSectionHeading from "@/components/form-section-heading";
import { UserPayloadType } from "@/types/user";
import { ApiFetchPromiseMessage } from "@/types/data-response";

const formSchemaBase = z.object({
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

const formSchemaNoSecName = formSchemaBase.merge(z.object({
    secFirstName:
        z.string().optional(),
    secLastName:
        z.string().optional(),
    secNameLang:
        z.literal(""),
}));

const formSchemaHasSecName = formSchemaBase.merge(z.object({
    secFirstName:
        z.string().min(2, {
            message: "First Name must be at least 2 characters.",
        }),
    secLastName:
        z.string().min(1, {
            message: "Last Name must be at least 1 characters.",
        }),
    secNameLang:
        z.string().min(1, {
            message: "Please select the language of your secondary name.",    
        }),
}));

const formSchema = z.union([formSchemaNoSecName, formSchemaHasSecName]);

interface NameValues {
    first: string;
    last: string;
    lang: string;
}

export default function UserEditForm() {

    // const { t, i18n } = useTranslation();
    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const navigate = useNavigate();
    const { id = "" } = useParams();
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

    const formDefaultValues = extractUserFormData(response);

    const [hasSecName, setHasSecName] = useState(formDefaultValues.secFirstName !== '' || formDefaultValues.secLastName !== '' ? true : false);
    const [isLoading, setIsLoading] = useState(false);

        // 1. Define your form.
    type FormShape = z.infer<typeof formSchema>
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        shouldFocusError: false,
        defaultValues: {
            ...formDefaultValues
        },
        // shouldUnregister: false
    });

    const primNameLangFieldValue = form.watch("primNameLang");
    const secNameLangFieldValue = form.watch("secNameLang");

    const releaseSecNameFields = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setHasSecName(true);
    }

    const clearSecNameValues = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        form.setValue("secFirstName", formDefaultValues.secFirstName);
        form.setValue("secLastName", formDefaultValues.secLastName);
        form.setValue("secNameLang", formDefaultValues.secNameLang);
        setHasSecName(false);
    }

    const swapNames = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("!!! SWAP called !!!");
        e.preventDefault();
        const primNameValInst: NameValues = {
            first: form.getValues("primFirstName") || "",
            last: form.getValues("primLastName") || "",
            lang: form.getValues("primNameLang") || ""
        };
        const secNameValInst: NameValues = {
            first: form.getValues("secFirstName") || "",
            last: form.getValues("secLastName") || "",
            lang: form.getValues("secNameLang") || ""
        };
        form.setValue("primFirstName", secNameValInst.first, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        form.setValue("primLastName", secNameValInst.last, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        form.setValue("primNameLang", secNameValInst.lang, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        form.setValue("secFirstName", primNameValInst.first, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        form.setValue("secLastName", primNameValInst.last, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        form.setValue("secNameLang", primNameValInst.lang, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }

    // 2. Define a submit handler.
    const onSubmit: SubmitHandler<FormShape> = async (data) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log("form ?", form);
        // console.log("form isDirty?", form?.formState?.isDirty);
        // console.log("form dirtyFields => ", form?.formState?.dirtyFields);
        console.log("!!! onSubmit : form values =>", data);

        if (form?.formState?.isDirty && Object.keys(form?.formState?.dirtyFields).length > 0) {
            setIsLoading(true);
            let payloadCollection: UserPayloadType = {};
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
            payloadCollection = {
                ...payloadCollection,
                ...(dirtyFields.gender ? { gender: data.gender }: null),
                ...(dirtyFields.dateOfBirth ? { dateOfBirth: data.dateOfBirth }: null),
                ...(dirtyFields.countryCode ? { mobileCountryCode: data.countryCode }: null),
                ...(dirtyFields.mobileNum ? { mobileNum: data.mobileNum }: null),
                ...(dirtyFields.email ? { email: data.email }: null),
            };
            toast.promise(userUpdater({
                id: id,
                body: payloadCollection,
                language: language,
                successMessage: {
                    title: t("user.success.update.title"),
                    description: t("user.success.update.description", {
                        fullName: ["zh-TW"].indexOf(language) < 0 ?
                            `${data.primFirstName} ${data.primLastName}` :
                            `${data.primLastName}${data.primFirstName}`
                    })
                }
            }), {
                loading: t('loading', { ns: 'common' }),
                success: (data: { title: string, description: string }) => {
                    navigate("/users");
                    return {
                        message: data.title,
                        description: data.description
                    };
                },
                error: 'Error',
            });
        }
    }
    

    useEffect(()=>{
        console.log("!!! Fill the form with default values !!!")
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
        console.log("form primNameLangFieldValue ?", primNameLangFieldValue);
        console.log("form secNameLangFieldValue ?", secNameLangFieldValue);
    },[form.formState.errors]);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`user.heading.edit`)}</PageHeaderHeading>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 self-stretch">
                    <Separator />
                    <FormSectionHeading>{t(`user.heading.${hasSecName ? 'primName' : 'name'}`)}</FormSectionHeading>
                    <div className={`flex items-start gap-x-[1.25rem] !mt-4`}>
                        <FormField
                            control={form.control}
                            name="primNameLang"
                            render={SelectFieldRenderer({
                                initFieldValueState: formDefaultValues.primNameLang,
                                name: "primNameLang",
                                label: t('user.language', {lng: primNameLangFieldValue}),
                                description: t('user.description.primNameLang', {lng: primNameLangFieldValue}),
                                placeholder: t('user.placeholder.language', {lng: primNameLangFieldValue}),
                                className: "basis-1/5",
                                optionValues: languageValues,
                                disabled: isLoading,
                                control: form.control
                            })}
                        />
                        <div className={`flex items-start gap-x-[1.25rem] basis-4/5 ${['zh-TW'].indexOf(primNameLangFieldValue) >= 0 ? " flex-row-reverse":""}`}>
                            <FormField
                                control={form.control}
                                name="primFirstName"
                                render={({ field })=>(
                                    <FormItem className={"flex-grow"}>
                                        <FormLabel>{t("user.firstName", {lng: primNameLangFieldValue})}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t("generic.name.first", {lng: primNameLangFieldValue})}
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>{t("user.description.firstName", {lng: primNameLangFieldValue})}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="primLastName"
                                render={({ field })=>(
                                    <FormItem className={"flex-grow"}>
                                        <FormLabel>{t("user.lastName", {lng: primNameLangFieldValue})}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t("generic.name.last", {lng: primNameLangFieldValue})}
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>{t("user.description.lastName", {lng: primNameLangFieldValue})}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex items-center !mt-4">
                        <Separator
                            className="!w-auto flex-grow"
                            lineStyle={hasSecName ? "dotted" : "normal"}
                        />
                        {!hasSecName && (
                            <Button variant={"ghost"} onClick={releaseSecNameFields}>
                                <PlusIcon />
                                {t('user.button.anotherName')}
                            </Button>
                        )}
                        {hasSecName && (
                            <Button variant={"ghost"} onClick={swapNames}>
                                <ArrowUpDown />
                                {t('user.button.swapName')}
                            </Button>
                        )}
                        <Separator
                            className="!w-auto flex-grow"
                            lineStyle={hasSecName ? "dotted" : "normal"}
                        />
                    </div>
                    {hasSecName && (
                        <>
                            <div className="flex justify-between item-centers !mt-4">
                                <FormSectionHeading>{t(`user.heading.${hasSecName ? 'secName' : 'name'}`)}</FormSectionHeading>
                                <Button variant={"outline"} size={"icon"} onClick={clearSecNameValues}>
                                    <Trash2Icon />
                                </Button>
                            </div>
                            <div className={`flex items-start gap-x-[1.25rem] !mt-4`}>
                                <FormField
                                    control={form.control}
                                    name="secNameLang"
                                    render={SelectFieldRenderer({
                                        initFieldValueState: formDefaultValues.secNameLang,
                                        name: "secNameLang",
                                        label: t('user.language', {lng: secNameLangFieldValue}),
                                        description: t('user.description.secNameLang', {lng: secNameLangFieldValue}),
                                        placeholder: t('user.placeholder.language', {lng: secNameLangFieldValue}),
                                        className: "basis-1/5",
                                        optionValues: languageValues,
                                        disabled: isLoading,
                                        control: form.control
                                    })}
                                />
                                <div className={`flex items-start gap-x-[1.25rem] basis-4/5 ${['zh-TW'].indexOf(secNameLangFieldValue) >= 0 ? " flex-row-reverse":""}`}>
                                    <FormField
                                        control={form.control}
                                        name="secFirstName"
                                        render={({ field })=>(
                                            <FormItem className={"flex-grow"}>
                                                <FormLabel>{t("user.firstName", {lng: secNameLangFieldValue})}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t("generic.name.first", {lng: secNameLangFieldValue})}
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>{t("user.description.firstName", {lng: secNameLangFieldValue})}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="secLastName"
                                        render={({ field })=>(
                                            <FormItem className={"flex-grow"}>
                                                <FormLabel>{t("user.lastName", {lng: secNameLangFieldValue})}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t("generic.name.last", {lng: secNameLangFieldValue})}
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>{t("user.description.lastName", {lng: secNameLangFieldValue})}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
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
                                disabled: isLoading,
                                control: form.control
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
                                disabled: isLoading,
                                control: form.control
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