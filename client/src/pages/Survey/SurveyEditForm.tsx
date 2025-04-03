import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { cn, covertObjectOfRecordsToMap, extractFullNameFromRawTranslations, extractSurveyFormData, extractSurveyTitleFromRawTranslations } from "@/lib/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon, ArrowUpDown, Loader2, Trash2Icon, AsteriskIcon } from "lucide-react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import FormSectionHeading from "@/components/form-section-heading";
import FormFieldRenderer from "@/components/form-field-renderer";

import { createSurveyUpdatePromise } from "@/loaders";
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

export default function SurveyEditForm() {

    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const callToastPromiseHook = useToastPromise();
    const navigate = useNavigate();
    const { id = "" } = useParams();
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

    const formDefaultValues = extractSurveyFormData(response, { language });

    // console.log('formDefaultValues => ', formDefaultValues);
    
    const [isLoading, setIsLoading] = useState(false);
    type FormShape = z.infer<typeof formSchema>;
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        shouldFocusError: false,
        defaultValues: {
            ...formDefaultValues
        },
        // shouldUnregister: false
    });

    const { fields: translationFields } = useFieldArray({ control: form.control, name: "translations" });

    const insertTranslation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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

    const removeTranslation = (e:any, index: number) => {
        e.preventDefault();
        console.log('removeTranslation => index => ', index);
        if (index > -1) { // only splice array when item is found
            // array.splice(index, 1); // 2nd parameter means remove one item only
            const newTranslations = translationFields.filter((field, i)=>i !== index);
            console.log('removeTranslation => newTranslations => ', newTranslations);
            form.setValue("translations", [...newTranslations]);
        }
    }

    const callToastPromise = (args: {
        id: string;
        payload: SurveyPayloadType;
        language: string;
    }) => {
        callToastPromiseHook({
            promise: createSurveyUpdatePromise,
            args: [args.id, args.payload, args.language],
            loadingMessage: t('loading', { ns: 'common' }),
            successMessage: ({data})=>{
                console.log('data => ', data);
                const {survey} = data;
                const title = extractSurveyTitleFromRawTranslations(survey.translations);
                return {
                    message: t('survey.success.update.title'),
                    description: t('survey.success.update.description', { title })
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
    }

    const onSubmit: SubmitHandler<FormShape> = async (data) => {

        console.log("!!! Form Submitted !!! data => ", data);
        // console.log("form isDirty?", form?.formState?.isDirty);
        // console.log("form dirtyFields => ", form?.formState?.dirtyFields);

        if (form?.formState?.isDirty && Object.keys(form?.formState?.dirtyFields).length > 0) {
            setIsLoading(true);
            let payloadCollection: SurveyPayloadType = {};
            const dirtyFields = form.formState.dirtyFields;
            console.log("form dirtyFields => ", form?.formState?.dirtyFields);

            payloadCollection = {
                ...payloadCollection,
                ...(dirtyFields?.translations && {
                    translations: Object.keys(dirtyFields.translations).reduce((accm, curr)=> {
                        const dirtyTranslation:{
                            title: string;
                            body: string;
                            language: string;
                        } = data.translations[parseInt(curr)];
                        const dirtyTranslationFields = dirtyFields.translations && dirtyFields.translations[parseInt(curr)]
                            ? Object.keys(dirtyFields.translations[parseInt(curr)])
                            : [];
                        return {
                            ...accm,
                            [dirtyTranslation.language]: {
                                ...dirtyTranslationFields.filter((key)=>key!=='language').reduce((accm, curr)=>{
                                    return {
                                        ...accm,
                                        [curr]: dirtyTranslation[curr as 'title' | 'body']
                                    };
                                }, {})
                            }
                        };
                    }, {})
                }),
                ...(dirtyFields?.authorId && { authorId: data.authorId })
            }
            console.log("payloadCollection => ", payloadCollection);    
            callToastPromise({id, payload: payloadCollection, language});
        }

    }
    
    useEffect(()=>{

        // console.log("form => ", form);
        // console.log("translationFields => ", translationFields);
        console.log("formDefaultValues.authorId => ", formDefaultValues.authorId);
        authorSelectionHandler(formDefaultValues.authorId);

    },[form.setValue]);

    useEffect(()=>{
        console.log("tracking errors =>",form.formState.errors);
    },[form.formState.errors]);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`survey.heading.edit`)}</PageHeaderHeading>
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
                                className={`flex items-start gap-x-[1.25rem] !mt-4 relative`}
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
                                {index > 0 ? (
                                    <Button
                                        variant={"outline"}
                                        size={"icon"}
                                        onClick={(e)=>removeTranslation(e, index)}
                                        disabled={isLoading}
                                        className={"!w-10"}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                ) : (
                                    <div className="!w-10 flex items-center justify-center text-foreground/60">
                                        <AsteriskIcon />
                                    </div>
                                )}
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
                            <Card className={`rounded-md px-3 py-2 flex space-x-4 border border-input ${selectedAuthor ? 'ring-1 ring-ring border-opacity-50' : ''}`}>
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
                        <div className="!w-10 flex items-center justify-center text-foreground/60">
                            <AsteriskIcon />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Link to="/surveys">
                            <Button variant="outline" disabled={isLoading}><ArrowLeftIcon />{t("action.back", { ns: "common" })}</Button>
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