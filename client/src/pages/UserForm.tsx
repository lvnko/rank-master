import CountryCodeType from "@/types/country-code";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData } from "react-router-dom";
import { z } from "zod"
import { cn } from "@/lib/utils"
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
import { CaretSortIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";

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
    currLangFirstName: z.string({
        required_error: "First Name is required"
    }).min(2, {
        message: "First Name must be at least 2 characters.",
    }),
    currLangLastName: z.string({
        required_error: "Last Name is required"
    }).min(1, {
        message: "Last Name must be at least 2 characters.",    
    }),
    gender: z.enum(["M", "F"], {
        required_error: "You need to select a gender.",
    }),
    // dateOfBrith: z.string().date(),
    countryCode: z.string().min(1, {
        message: "Please select a country code.",
    }),
    mobileNum: z.string().min(8, {
        message: "Please provide a valid mobile phone number."
    }),
    email: z.string().email({
        message: "Please provide a valid email address."
    }).min(5, {
        message: "Please provide a valid email address."
    })
})


export default function UserForm() {

    // const { t, i18n } = useTranslation();
    const { t, i18n } = useTranslation();
    const { language } = i18n;

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

    // 1. Define your form.
    type FormShape = z.infer<typeof formSchema>
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currLangFirstName: "",
            currLangLastName: "",
            gender: undefined,
            countryCode: "",
            mobileNum: "",
            email: ""
        },
    });

    useEffect(()=>{
        console.log("countryCodes =>", countryCodes);
    },[]);

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
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t('user.heading.add')}</PageHeaderHeading>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 self-stretch">
                    <div className={`flex items-start gap-x-[1.25rem]${['zh-TW'].indexOf(language) >= 0 ? " flex-row-reverse":""}`}>
                        <FormField
                            control={form.control}
                            name="currLangFirstName"
                            render={({ field })=>(
                                <FormItem className="flex-grow">
                                    <FormLabel>{t("user.firstName")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("generic.name.first")} {...field} />
                                    </FormControl>
                                    <FormDescription>{t("user.description.firstName")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currLangLastName"
                            render={({ field })=>(
                                <FormItem className="flex-grow">
                                    <FormLabel>{t("user.lastName")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("generic.name.last")} {...field} />
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
                            <FormItem className="space-y-3">
                                <FormLabel>{t('user.gender')}</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
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
                    </div>
                    <div className="flex items-start gap-x-[1.25rem]">
                        <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field })=>(
                                <FormItem className="flex flex-col basis-1/2">
                                    <div>
                                        <FormLabel className="!inline">{t("user.countryCode")}</FormLabel>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger className="w-full" asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
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
                                <FormItem className="basis-1/2">
                                    <FormLabel>{t("user.mobileNum")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("user.placeholder.mobileNum")} {...field} />
                                    </FormControl>
                                    <FormDescription>{t("user.description.mobileNum")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-start gap-x-[1.25rem]">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field })=>(
                                <FormItem className="basis-1/2">
                                    <FormLabel>{t("user.email")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("user.placeholder.email")} {...field} />
                                    </FormControl>
                                    <FormDescription>{t("user.description.email")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="basis-1/2"></div>
                    </div>
                    <div className="flex justify-between">
                        <Link to="/users">
                            <Button variant="outline"><ArrowLeftIcon />Back</Button>
                        </Link>
                        <Button type="submit">{t('button.submit', { ns: 'common' })}</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}