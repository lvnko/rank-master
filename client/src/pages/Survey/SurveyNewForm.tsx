
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
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

const formSchema = z.object({
    translations: z.object({
        title: z.string(),
        body: z.string(),
        language: z.string()
    }).array().min(1),
    authorId: z.string().min(24)
});
// 67e6d4d4e564dc08d90d24b8

export default function SurveyNewForm() {

    // const { t, i18n } = useTranslation();
    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const callToastPromiseHook = useToastPromise();
    const navigate = useNavigate();

}