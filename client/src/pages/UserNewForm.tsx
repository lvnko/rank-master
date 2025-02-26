import CountryCodeType from "@/types/country-code";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { z } from "zod"
import { cn, extractPrimaryNameLang } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { CaretSortIcon } from "@radix-ui/react-icons";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { ArrowLeftIcon, CheckIcon, Loader2 } from "lucide-react";
import { userPoster } from "@/loaders";

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


export default function UserForm() {

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
            gender: undefined,
            dateOfBirth: undefined,
            countryCode: "",
            mobileNum: "",
            email: ""
        },
    });

    // useEffect(()=>{
    //     // console.log("response?.data =>", response?.data);
    //     const userData = response?.data?.user || null;
    //     if (userData) {
            
    //         console.log('userData => ', userData);
    //         console.log('form => ', form);
    //         // console.log('languageValues => ', languageValues);
    //         // console.log('countryCodes => ', countryCodes);
    //         const {
    //             translations,
    //             gender,
    //             dateOfBirth,
    //             email,
    //             mobileNum,
    //             mobileCountryCode
    //         } = userData;
    //         const primName = Object.keys(translations).filter(lang => translations[lang].isPrimary);
    //         const {
    //             firstName: primFirstName,
    //             lastName: primLastName,
    //         } = primName.length > 0 ? translations[primName[0]] : {
    //             firstName: "",
    //             lastName: "",
    //         };
    //         form.setValue("primFirstName", primFirstName);
    //         form.setValue("primLastName", primLastName);
    //         form.setValue("primNameLang", primName[0]);
    //         form.setValue("gender", gender);
    //         form.setValue("dateOfBirth", dateOfBirth);
    //         form.setValue("mobileNum", mobileNum);
    //         form.setValue("countryCode", countryCodes.filter(({ code }) => code === mobileCountryCode)[0].name || "");
    //         form.setValue("email", email);
    //     }

    // },[form.setValue]);

    useEffect(()=>{
        console.log("tracking errors =>",form.formState.errors);
    },[form.formState.errors]);
   
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
        toast.promise(userPoster({
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
                <PageHeaderHeading>{t(`user.heading.add`)}</PageHeaderHeading>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 self-stretch">
                    <div className={`flex items-start gap-x-[1.25rem]${['zh-TW'].indexOf(language) >= 0 ? " flex-row-reverse":""}`}>
                        {/* {isEdit && (
                            <FormField
                                control={form.control}
                                name="primNameLang"
                                render={FormSelectFieldItemRender({
                                    initFieldValueState: isEdit && response?.data?.user?.translations ?
                                        extractPrimaryNameLang(response.data.user.translations) :
                                        language,
                                    name: "primNameLang",
                                    label: "Language",
                                    description: "Language of primary name.",
                                    placeholder: "Select Language",
                                    className: "basis-1/5",
                                    optionValues: languageValues
                                })}
                            />
                        )} */}
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
                    <div className="flex items-start gap-x-[1.25rem]">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="space-y-3 basis-1/2">
                                    <FormLabel>{t('user.gender')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isLoading}
                                            className="flex flex-row space-x-4"
                                        >
                                            {genderValues.map((g) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={g.value} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {g.label}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem className="space-y-3 basis-1/2">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            value={field.value} onChange={field.onChange}
                                            displayFormat={{ hour24: 'dd/MM/yyyy' }}
                                            granularity={'day'}
                                            yearRange={100}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
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
                            <Button variant="outline"><ArrowLeftIcon />Back</Button>
                        </Link>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (<Loader2 className="animate-spin" />)}
                            {t(isLoading ? 'loading' : 'button.submit', { ns: 'common' })}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}