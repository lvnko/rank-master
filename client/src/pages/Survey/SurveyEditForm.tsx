import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { cn, covertObjectOfRecordsToMap, extractFullNameFromRawTranslations, extractSurveyFormData } from "@/lib/utils";
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

export default function SurveyEditForm() {

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

    const formDefaultValues = extractSurveyFormData(response);

    console.log('formDefaultValues => ', formDefaultValues);
    
    const [isLoading, setIsLoading] = useState(false);
    type FormShape = z.infer<typeof formSchema>;
    const form = useForm<FormShape>({
        resolver: zodResolver(formSchema),
        shouldFocusError: false,
        defaultValues: {
            translations: [{ title: '', body: '', language: language }],
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

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`survey.heading.edit`)}</PageHeaderHeading>
            </PageHeader>

        </div>
    );
}