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

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageHeader className="justify-start item-center space-x-4 w-full">
                <PageHeaderHeading>{t(`survey.heading.edit`)}</PageHeaderHeading>
            </PageHeader>
        </div>
    );
}