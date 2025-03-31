
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { cn, covertObjectOfRecordsToMap, extractFullNameFromRawTranslations } from "@/lib/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon, ArrowUpDown, Loader2, Trash2Icon } from "lucide-react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import FormSectionHeading from "@/components/form-section-heading";
import FormFieldRenderer from "@/components/form-field-renderer";

import { createSurveyInsertionPromise } from "@/loaders";
import useToastPromise from "@/hooks/useToastPromise";
import { SurveyPayloadType } from "@/types/survey";
import LanguageType from "@/types/languages";
import { UserRawType } from "@/types/user";

const formSchema = z.object({
    translations: z.array(
        z.object({
            title: z.string().min(3),
            body: z.string().min(5),
            language: z.string().min(1)
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
    const [selectedAuthor, setSelectedAuthor] = useState<UserRawType & {
        primName: string
        secName: string
    } | null>(null);
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
        console.log('insertTranslation => translationFields => ',translationFields);
        console.log('insertTranslation => form.getValues("translations") => ',form.getValues("translations"));
        const newTranslationDefaultValues = { title: '', body: '', language: '' };
        form.setValue("translations", [
            ...form.getValues("translations"),
            newTranslationDefaultValues
        ]);
    }
    const authorSelectionHandler = (id: string) => {
        console.log('selected author id => ', id);
        const [selectedAuthorProfile] = authorsLib.filter(({_id})=>_id === id);
        console.log('selected author profile => ', selectedAuthorProfile);
        setSelectedAuthor({
            ...selectedAuthorProfile,
            primName: extractFullNameFromRawTranslations(selectedAuthorProfile.translations || {}),
            secName: extractFullNameFromRawTranslations(selectedAuthorProfile.translations || {}, { toGetPrimary: false})
        });
    }

    const callToastPromise = (args: {
        id: string;
        payload: SurveyPayloadType;
        language: string;
    }) => {
        callToastPromiseHook({
            promise: createSurveyInsertionPromise,
            args: [args.id, args.payload, args.language],
            loadingMessage: t('loading', { ns: 'common' }),
            successMessage: ({data: {survey}})=>{
                // const primFullName = extractFullNameFromRawTranslations(user.translations, { toGetPrimary: true });
                const translations = covertObjectOfRecordsToMap(survey.translations);
                const surveyTitle = (translations.get(language) as { title?: string })?.title || 
                                     (translations.get('en-US') as { title?: string })?.title || t(`survey.label.survey`);
                const surveyTitleTrimmed = surveyTitle.length > 12 ? `${surveyTitle.slice(0, 12)}...` : surveyTitle;
                return {
                    message: t('survey.success.update.title'),
                    description: t('survey.success.update.description', { title: surveyTitleTrimmed })
                };
            },
            errorMessage: t('survey.error.update'),
            callback: () => {
                setIsLoading(false);
                navigate("/surveys");
            },
            errorCallback: ()=> {
                setIsLoading(false);
            }
        });
    };

    const onSubmit: SubmitHandler<FormShape> = async (data) => {

        console.log("!!! Form Submitted !!! data => ", data);
        setIsLoading(true);

        const { translations, authorId } = data;
        const payload: SurveyPayloadType = {
            translations: translations.reduce((accm, {language, ...props})=>{
                return {
                    ...accm,
                    [language]: props
                }
            }, {})
        };
        
        callToastPromise({
            id: authorId,
            payload,
            language
        });
    }

    useEffect(()=>{

        // console.log("form => ", form);
        // console.log("translationFields => ", translationFields);
        // console.log("translationFields.length => ", translationFields.length);    

    },[form.setValue]);

    useEffect(()=>{
        console.log("tracking errors =>",form.formState.errors);
        // console.log("form primNameLangFieldValue ?", primNameLangFieldValue);
        // console.log("form secNameLangFieldValue ?", secNameLangFieldValue);
    },[form.formState.errors]);

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
                        <div key={`${field.id}-wrapper`}>
                            {index > 0 && (<Separator key={`${field.id}-separator`} lineStyle={"dotted"} />)}
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
                        </div>
                    ))}
                    {translationFields.length < languageValues.length ? (
                        <div className="flex items-center !mt-6">
                            <Separator
                                className="!w-auto flex-grow"
                                lineStyle={"normal"}
                            />
                            <Button
                                variant={"ghost"}
                                disabled={isLoading}
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
                    ) : (<Separator lineStyle={"normal"} />)}
                    <FormSectionHeading>{t(`survey.heading.author`)}</FormSectionHeading>
                    <div className={`flex items-start gap-x-[1.25rem] !mt-4`}>
                        <FormFieldRenderer
                            control={form.control}
                            name={"authorId"}
                            className={"flex flex-col basis-1/5"}
                            type={"ComboBox"}
                            disabled={isLoading}
                            label={t("survey.label.author")}
                            placeholder={t("survey.placeholder.author")}
                            optionValues={authorValues}
                            onSelected={(name, value) => {
                                console.log(`setValue of ${name} to ${value}`);
                                form.setValue(name as keyof FormShape, value, { shouldDirty: true });
                                authorSelectionHandler(value);
                            }}
                        />
                        <div className={`space-y-3 basis-4/5`}>
                            <p className="text-sm font-medium">{t(`survey.label.authorPreview`)}</p>
                            <Card className={`px-3 py-2 flex space-x-4`}>
                                <Avatar
                                    className={`w-16 h-16`}
                                >
                                    <AvatarImage
                                        src={`/images/avatar-${
                                            selectedAuthor ?
                                            selectedAuthor.gender === 'M' ? 'male' : 'female' :
                                            'unknown'
                                        }.png`}
                                    />
                                    <AvatarFallback>?</AvatarFallback>
                                </Avatar>
                                {selectedAuthor ? (
                                    <div className={`flex justify-between grow space-x-2`}>
                                        <div className={`flex flex-col grow items-start space-y-1`}>
                                            <p className={`text-lg`}>{selectedAuthor.primName}</p>
                                            {selectedAuthor.secName && (<p className={`text-sm`}>{selectedAuthor.secName}</p>)}
                                            <div className={`space-x-1`}>
                                                <Badge className={`!my-2 px-2 py-0.5`} variant="secondary">{t(`user.valueLabel.status.${selectedAuthor.status}`)}</Badge>
                                                {selectedAuthor.role && <Badge className={`!my-2 px-2 py-0.5`} variant="secondary">
                                                    {t(`user.abbr.role`)} : {t(`user.valueLabel.role.${selectedAuthor.role}`)}
                                                </Badge>}
                                                {selectedAuthor.subscription && <Badge className={`!my-2 px-2 py-0.5`} variant="secondary">
                                                {t(`user.abbr.subscription`)} : {t(`user.valueLabel.subscription.${selectedAuthor.subscription}`)}
                                                </Badge>}
                                            </div>
                                        </div>
                                        <div className={`flex flex-col items-center grow`}>
                                            <p className={`text-sm font-bold text-foreground/40`}>{t(`user.label.surveysCreated`)}</p>
                                            <p className={`flex text-2xl grow items-center`}>{selectedAuthor.surveysCreated || 0}</p>
                                        </div>
                                        <div className={`flex flex-col items-center grow`}>
                                            <p className={`text-sm font-bold text-foreground/40`}>{t(`user.label.surveysParticipated`)}</p>
                                            <p className={`flex text-2xl grow items-center`}>{selectedAuthor.surveysParticipated || 0}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex justify-center items-center flex-grow`}>
                                        <p className="text-sm font-light text-foreground/60">{t(`survey.placeholder.authorPreview`)}</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={(e)=>{
                                e.preventDefault();
                                navigate("/surveys");
                            }}
                        >
                            <ArrowLeftIcon />{t("action.back", { ns: "common" })}
                        </Button>
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