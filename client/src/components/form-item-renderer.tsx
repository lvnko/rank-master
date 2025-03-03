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
import { ControllerProps, FieldValues, FieldPath, useWatch, Control } from "react-hook-form";

interface RendererPropsType<T extends FieldValues> {
    initFieldValueState: string,
    name: string,
    label: string,
    description?: string,
    placeholder?: string,
    className: string,
    optionValues: {value: string, label: string}[],
    disabled: boolean,
    control: Control<T>;
}

type DateTimePickerRendererPropsType<T extends FieldValues> = Omit<RendererPropsType<T>, 'initFieldValueState' | 'optionValues'> & {
    initFieldValueState: Date
};

export function SelectFieldRenderer ({
    initFieldValueState,
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
    initFieldValueState,
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
    initFieldValueState,
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