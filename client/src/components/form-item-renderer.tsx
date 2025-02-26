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

interface RendererPropsType {
    initFieldValueState: string,
    name: string,
    label: string,
    description?: string,
    placeholder?: string,
    className: string,
    optionValues: {value: string, label: string}[],
    disabled: boolean
}

export function SelectFieldRenderer ({
    initFieldValueState,
    name,
    label,
    description = '',
    optionValues,
    placeholder,
    className,
    disabled = false
} : RendererPropsType) {
    return function ({ field }: any) {

        const [fieldValueState, setFieldValueState] = useState<string>(initFieldValueState);
    
        return (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <Select
                    onValueChange={(e)=>{
                        setFieldValueState(e);
                        field.onChange(e)
                    }}
                    value={fieldValueState}
                    disabled={disabled}
                >
                    <FormControl>
                        <SelectTrigger>
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
    disabled = false
} : RendererPropsType) {
    
    const [fieldValueState, setFieldValueState] = useState<string>(initFieldValueState);

    return function({ field }: any) {
        return (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={(e)=>{
                            setFieldValueState(e);
                            field.onChange(e)
                        }}
                        defaultValue={fieldValueState}
                        disabled={disabled}
                        className="flex flex-row space-x-4"
                    >
                        {optionValues.map((g, index) => (
                            <FormItem key={`${name}-radio-${index}`} className="flex items-center space-x-3 space-y-0">
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
                <FormDescription>{description}</FormDescription>
                <FormMessage />
            </FormItem>
        );
    }
}