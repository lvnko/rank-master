
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { cn, extractFullNameFromRawTranslations } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PlusIcon } from "@radix-ui/react-icons";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { ArrowLeftIcon, ArrowUpDown, Loader2, Trash2Icon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import FormSectionHeading from "@/components/form-section-heading";
import { SurveyPayloadType } from "@/types/survey";
import FormFieldRenderer from "@/components/form-field-renderer";
import { createSurveyInsertionPromise } from "@/loaders";
import useToastPromise from "@/hooks/useToastPromise";
import LanguageType from "@/types/languages";
import { UserRawType } from "@/types/user";

const formSchema = z.object({
    translations: z.array(
        z.object({
            title: z.string(),
            body: z.string(),
            language: z.string()
        })
    ).min(1),
    authorId: z.string().min(24)
});
// 67e6d4d4e564dc08d90d24b8

export default function SurveyNewForm() {

    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const callToastPromiseHook = useToastPromise();
    const navigate = useNavigate();
    const params = useParams();
    const response: any = useLoaderData();

    const supportedLanguagesLib: LanguageType[] = response?.data?.languages || [];
    const languageValues = supportedLanguagesLib.map(({name, label})=>{
        return {label, value: name};
    });

    const authorsLib: UserRawType[] = response?.data?.users || [];
    const authorValues = authorsLib.map(({ _id: id, translations })=>{
        return {
            value: id,
            label: extractFullNameFromRawTranslations(translations)
        };
    });

    const [isLoading, setIsLoading] = useState(false);
    type FormShape = z.infer<typeof formSchema>;
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        shouldFocusError: false,
        defaultValues: {
            translations: [{ title: '', body: '', language: language}],
            authorId: ''
        },
        // shouldUnregister: false
    });

    const { fields: translationFields } = useFieldArray({ control: form.control, name: "translations" });

    const insertTranslation = () => {

    }

    const onSubmit: SubmitHandler<FormShape> = async (data) => {

    }

    useEffect(()=>{

        console.log("form => ", form);
        console.log("translationFields => ", translationFields);
        console.log("translationFields.length => ", translationFields.length);    

    },[form.setValue]);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`survey.heading.add`)}</PageHeaderHeading>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 self-stretch">
                    <Separator />
                    <FormSectionHeading>{t(`survey.heading.introDesc`)}</FormSectionHeading>
                    {translationFields.map((field, index)=>(
                        <div
                            key={field.id}
                            className={`flex items-start gap-x-[1.25rem] !mt-4`}
                        >
                            <FormFieldRenderer
                                control={form.control}
                                name={`translations.${index}.language`}
                                className={"basis-1/5"}
                                type={"Select"}
                                disabled={isLoading}
                                label={t('survey.label.introLang')}
                                placeholder={t('survey.placeholder.introLang')}
                                description={t('survey.description.introLang')}
                                optionValues={languageValues}
                            />
                            <div className={`flex flex-col items-start gap-y-[1rem] basis-4/5`}>
                                <FormFieldRenderer
                                    control={form.control}
                                    name={`translations.${index}.title`}
                                    className={"flex-grow self-stretch"}
                                    type={"Input"}
                                    disabled={isLoading}
                                    label={t("survey.label.title")}
                                    placeholder={t("survey.placeholder.title")}
                                    description={t("survey.description.title")}
                                />
                                <FormFieldRenderer
                                    control={form.control}
                                    name={`translations.${index}.body`}
                                    className={"flex-grow self-stretch"}
                                    type={"TextArea"}
                                    disabled={isLoading}
                                    label={t("survey.label.body")}
                                    placeholder={t("survey.placeholder.body")}
                                    description={t("survey.description.body")}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center !mt-6">
                        <Separator
                            className="!w-auto flex-grow"
                            lineStyle={"normal"}
                        />
                        <Button
                            variant={"ghost"}
                            onClick={insertTranslation}
                            className={"pl-3 pr-4"}
                        >
                            <PlusIcon />
                            {t('survey.button.addIntroLang')}
                        </Button>
                        <Separator
                            className="!w-auto flex-grow"
                            lineStyle={"normal"}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );

}