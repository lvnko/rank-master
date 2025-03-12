import CountryCodeType from "@/types/country-code";
import LanguageType from "@/types/languages";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { cn, composeFullName, extractUserFormData } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PlusIcon } from "@radix-ui/react-icons";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { ArrowLeftIcon, ArrowUpDown, Loader2, Trash2Icon } from "lucide-react";

import { createUserUpdatePromise } from "@/loaders";
import { Separator } from "@/components/ui/separator";
import FormSectionHeading from "@/components/form-section-heading";
import { UserPayloadType } from "@/types/user";
import FormFieldRenderer from "@/components/form-field-renderer";

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

    const callToastPromise = (args: {
        id: string;
        payload: UserPayloadType;
        language: string;
    }) => {
        toast.promise(
            createUserUpdatePromise(args.id, args.payload, args.language),
            {
                loading: t('loading', { ns: 'common' }),
                success: (resData) => {
                    console.log('resData =>', resData);
                    const { message, data: { user } } = resData as {
                        message: string,
                        data: {
                            user: any
                        }
                    };
                    const { firstName, lastName } = user.translations[language || 'en-US'];
                    const userFullName = composeFullName({firstName, lastName, language});
                    setIsLoading(false);
                    navigate("/users");
                    return {
                        message: t('user.success.update.title') || message || `Success toast has been added`,
                        description: t('user.success.update.description', { fullName: userFullName }) || `Success description.`
                    };
                },
                error: (error) => {
                    console.log('error =>', error);
                    setIsLoading(false);
                    return `Error toast has been added`;
                },
            }
        );
    };

    // 2. Define a submit handler.
    const onSubmit: SubmitHandler<FormShape> = async (data) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log("form ?", form);
        // console.log("form isDirty?", form?.formState?.isDirty);
        // console.log("form dirtyFields => ", form?.formState?.dirtyFields);
        // console.log("!!! onSubmit : form values =>", data);

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

            callToastPromise({id, payload: payloadCollection, language});
        }
    }
    

    useEffect(()=>{
        console.log("!!! Fill the form with default values !!!")
        const userData = response?.data?.user || {};
        if (Object.keys(userData).length > 0) {
            // console.log("form => ", form);
            // console.log("formSchema => ", formSchema);
            const { formState:  { defaultValues = {} } } = form;
            console.log('defaultValues => ', defaultValues);
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
                        <FormFieldRenderer
                            control={form.control}
                            name="primNameLang"
                            className={"basis-1/5"}
                            type={"Select"}
                            disabled={isLoading}
                            label={t('user.language', {lng: primNameLangFieldValue})}
                            placeholder={t('user.placeholder.language', {lng: primNameLangFieldValue})}
                            description={t('user.description.primNameLang', {lng: primNameLangFieldValue})}
                            optionValues={languageValues}
                        />
                        <div className={`flex items-start gap-x-[1.25rem] basis-4/5 ${['zh-TW'].indexOf(primNameLangFieldValue) >= 0 ? " flex-row-reverse":""}`}>
                            <FormFieldRenderer
                                control={form.control}
                                name="primFirstName"
                                className={"flex-grow"}
                                type={"Input"}
                                disabled={isLoading}
                                label={t("user.firstName", {lng: primNameLangFieldValue})}
                                placeholder={t("generic.name.first", {lng: primNameLangFieldValue})}
                                description={t("user.description.firstName", {lng: primNameLangFieldValue})}
                            />
                            <FormFieldRenderer
                                control={form.control}
                                name="primLastName"
                                className={"flex-grow"}
                                type={"Input"}
                                disabled={isLoading}
                                label={t("user.lastName", {lng: primNameLangFieldValue})}
                                placeholder={t("generic.name.last", {lng: primNameLangFieldValue})}
                                description={t("user.description.lastName", {lng: primNameLangFieldValue})}
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
                                <FormFieldRenderer
                                    control={form.control}
                                    name="secNameLang"
                                    className={"basis-1/5"}
                                    type={"Select"}
                                    disabled={isLoading}
                                    label={t('user.language', {lng: secNameLangFieldValue})}
                                    placeholder={t('user.placeholder.language', {lng: secNameLangFieldValue})}
                                    description={t('user.description.secNameLang', {lng: secNameLangFieldValue})}
                                    optionValues={languageValues}
                                />
                                <div className={`flex items-start gap-x-[1.25rem] basis-4/5 ${['zh-TW'].indexOf(secNameLangFieldValue) >= 0 ? " flex-row-reverse":""}`}>
                                    <FormFieldRenderer
                                        control={form.control}
                                        name="secFirstName"
                                        className={"flex-grow"}
                                        type={"Input"}
                                        disabled={isLoading}
                                        label={t("user.firstName", {lng: secNameLangFieldValue})}
                                        placeholder={t("generic.name.first", {lng: secNameLangFieldValue})}
                                        description={t("user.description.firstName", {lng: secNameLangFieldValue})}
                                    />
                                    <FormFieldRenderer
                                        control={form.control}
                                        name="secLastName"
                                        className={"flex-grow"}
                                        type={"Input"}
                                        disabled={isLoading}
                                        label={t("user.lastName", {lng: secNameLangFieldValue})}
                                        placeholder={t("generic.name.last", {lng: secNameLangFieldValue})}
                                        description={t("user.description.lastName", {lng: secNameLangFieldValue})}
                                    />
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                    <FormSectionHeading>{t('user.heading.personal')}</FormSectionHeading>
                    <div className="flex items-start gap-x-[1.25rem]">
                        <FormFieldRenderer
                            control={form.control}
                            name="gender"
                            className={"space-y-3 basis-1/2"}
                            type={"RadioGroup"}
                            disabled={isLoading}
                            label={t('user.gender')}
                            optionValues={genderValues}
                        />
                        <FormFieldRenderer
                            control={form.control}
                            name="dateOfBirth"
                            className={"space-y-3 basis-1/2"}
                            type={"DateTimePicker"}
                            disabled={isLoading}
                            label={t('user.dateOfBirth')}
                        />
                    </div>
                    <Separator />
                    <h3 className="!scroll-m-8 text-xl font-semibold tracking-tight underline underline-offset-4 text-blue-500">{t('user.heading.contact')}</h3>
                    <div className="flex items-start gap-x-[1.25rem]">
                        <FormFieldRenderer
                            control={form.control}
                            name={"countryCode"}
                            className={"flex flex-col basis-1/5"}
                            type={"ComboBox"}
                            disabled={isLoading}
                            label={t("user.countryCode")}
                            placeholder={t("user.placeholder.countryCode")}
                            optionValues={countryCodeValues}
                            onSelected={(name, value) => {
                                console.log(`setValue of ${name} to ${value}`);
                                form.setValue(name as keyof FormShape, value, { shouldDirty: true });
                            }}
                        />
                        <FormFieldRenderer
                            control={form.control}
                            name="mobileNum"
                            className={"basis-2/5"}
                            type={"Input"}
                            disabled={isLoading}
                            label={t("user.mobileNum")}
                            placeholder={t("user.placeholder.mobileNum")}
                            description={t("user.description.mobileNum")}
                        />
                        <FormFieldRenderer
                            control={form.control}
                            name="email"
                            className={"basis-2/5"}
                            type={"Input"}
                            disabled={isLoading}
                            label={t("user.email")}
                            placeholder={t("user.placeholder.email")}
                            description={t("user.description.email")}
                        />
                    </div>
                    <div className="flex justify-between">
                        <Link to="/users">
                            <Button variant="outline" disabled={isLoading}><ArrowLeftIcon />Back</Button>
                        </Link>
                        <Button type="submit" disabled={!form.formState.isDirty || Object.keys(form.formState.dirtyFields)?.length === 0 || isLoading}>
                            {isLoading && (<Loader2 className="animate-spin" />)}
                            {t(isLoading ? 'loading' : 'button.submit', { ns: 'common' })}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );

}