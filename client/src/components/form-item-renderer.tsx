import { useEffect, useState } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateTimePicker } from '@/components/ui/datetime-picker';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { ControllerProps, FieldValues, FieldPath, useWatch, Control } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "./ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export interface RendererPropsType<T extends FieldValues> {
    name: string,
    label: string,
    description?: string,
    placeholder?: string,
    className: string,
    optionValues: {value: string, label: string}[],
    disabled: boolean,
    control: Control<T>;
}

export type InputRendererPropsType<T extends FieldValues> = Omit<RendererPropsType<T>, 'optionValues' | 'name' | 'control'>

export type TextAreaRendererPropsType<T extends FieldValues> = Omit<RendererPropsType<T>, 'optionValues' | 'name' | 'control'> & { resizable: boolean }

export type DateTimePickerRendererPropsType<T extends FieldValues> = Omit<RendererPropsType<T>, 'optionValues'>;

export type ComboBoxRendererPropsType<T extends FieldValues> = RendererPropsType<T> & { onSelected: (name: string, value: string) => void };

export function InputFieldRenderer ({
    label,
    description = '',
    placeholder,
    className,
    disabled = false,
}: InputRendererPropsType<any>) {

    return function ({ field }: any) {
        return (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        disabled={disabled}
                        {...field}
                    />
                </FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
            </FormItem>
        );
    }
}

export function TextAreaFieldRenderer ({
    label,
    description = '',
    placeholder,
    className,
    disabled = false,
    resizable = false
}: TextAreaRendererPropsType<any>) {

    return function ({ field }: any) {
        return (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        disabled={disabled}
                        className={resizable ? '' : 'resize-none'}
                        {...field}
                    />
                </FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
            </FormItem>
        );
    }
}

export function SelectFieldRenderer ({
    name,
    label,
    description = '',
    optionValues,
    placeholder,
    className,
    disabled = false,
    control
} : RendererPropsType<any>) {

    return function ({ field }: any) {

        const fieldValueWatched = useWatch({ control: control, name: name });
    
        return (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <Select
                    onValueChange={(e)=>{
                        // console.log("!!! values changed => ", e);
                        field.onChange(e);
                    }}
                    value={fieldValueWatched}
                    disabled={disabled}
                >
                    <FormControl>
                        <SelectTrigger ref={field.ref}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {optionValues.map(({value, label}: {value: string, label: string}, index: number)=>(
                            <SelectItem key={`${name}-option-${index}`} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormDescription>
                    {description}
                </FormDescription>
                <FormMessage />
            </FormItem>
        );
    }
}

export function RadioGroupRenderer ({
    name,
    label,
    description = '',
    optionValues,
    className,
    disabled = false,
    control
} : RendererPropsType<any>) {
    
    const fieldValueWatched = useWatch({ control: control, name: name });
    
    return function({ field }: any) {
        return (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={(e)=>{
                            field.onChange(e)
                        }}
                        defaultValue={fieldValueWatched}
                        disabled={disabled}
                        className="flex flex-row space-x-4"
                    >
                        {optionValues.map((g, index) => (
                            <FormItem key={`${name}-radio-${index}`} className="flex items-center space-x-3 space-y-0 py-2 !cursor-pointer">
                                <FormControl>
                                    <RadioGroupItem value={g.value} />
                                </FormControl>
                                <FormLabel className="font-normal !cursor-none">
                                    {g.label}
                                </FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
            </FormItem>
        );
    }
}

export function DateTimePickerRenderer ({
    name,
    label,
    description = '',
    className,
    disabled = false,
    control
} : DateTimePickerRendererPropsType<any>) {

    const fieldValueWatched = useWatch({ control: control, name: name });
    
    return ({ field }: any) => (
        <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <DateTimePicker
                    value={fieldValueWatched}
                    onChange={(e)=>{
                        if (e) {
                            field.onChange(e);
                        }
                    }}
                    displayFormat={{ hour24: 'dd/MM/yyyy' }}
                    granularity={'day'}
                    yearRange={100}
                    disabled={disabled}
                />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
        </FormItem>
    )
}

export function ComboBoxRenderer({
    name,
    control,
    label,
    description = '',
    placeholder,
    className = '',
    optionValues,
    disabled,
    onSelected = (name, value) => console.log(name, value)
}: ComboBoxRendererPropsType<any>) {

    const { t } = useTranslation();
    const fieldValueWatched = useWatch({ control: control, name: name });

    return ({ field }: any) => (
        <FormItem className={className}>
            <div>
                <FormLabel className='!inline'>{label}</FormLabel>
            </div>
            <Popover>
                <PopoverTrigger className="w-full" asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            disabled={disabled}
                            className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {fieldValueWatched && fieldValueWatched !== '' ?
                                optionValues.find(
                                    (code) => code.value === fieldValueWatched
                                )?.label
                                : placeholder}
                            <CaretSortIcon className="opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput
                            placeholder={t('placeholder.search', {ns: 'common', name: label})}
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>{t('fail.search', {ns: 'common', name: label})}</CommandEmpty>
                            <CommandGroup>
                                {optionValues.map((code) => (
                                    <CommandItem
                                        value={code.label}
                                        key={code.value}
                                        onSelect={() => {
                                            // form.setValue("countryCode", code.value)
                                            onSelected(name, code.value);
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
            <FormDescription>{description}</FormDescription>
            <FormMessage />
        </FormItem>
    )

}

// export function FormSelectField<
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
//   RendererPropsType
// > ({
//     control, name, initFieldValueState
// }: ControllerProps<TFieldValues>) {
//     return (
//         <FormField
//             control={control}
//             name={name}
//             render={RadioGroupRenderer}
//         />
//     );
// }