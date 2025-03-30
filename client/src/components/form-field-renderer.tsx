import React from 'react';
import { FormField, FormControl, FormDescription, FormMessage } from './ui/form';
import {
    InputFieldRenderer, SelectFieldRenderer, RadioGroupRenderer, DateTimePickerRenderer,
    RendererPropsType, InputRendererPropsType, TextAreaFieldRenderer,
    DateTimePickerRendererPropsType, ComboBoxRendererPropsType, ComboBoxRenderer,
    TextAreaRendererPropsType
} from "./form-item-renderer";
import { Control } from 'react-hook-form';

interface FormFieldRendererBasesProps {
    control: Control<any>;
    name: string;
    type: 'Input' | 'TextArea' | 'Select' | 'RadioGroup' | 'DateTimePicker' | 'ComboBox';
}

type FormFieldRendererProps =
    FormFieldRendererBasesProps &
    (
        RendererPropsType<any>
        | InputRendererPropsType<any>
        | TextAreaRendererPropsType<any>
        | DateTimePickerRendererPropsType<any>
        | ComboBoxRendererPropsType<any>
    ) &
    {
        optionValues?: any[],
        onSelected?: (name: string, value: any) => void,
        resizable?: boolean
    };

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
    control, name, type,
    className, label, disabled = false, resizable = false,
    description = '', placeholder = '',
    optionValues = [], onSelected = (name, value) => console.log(name, value)
}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={type === 'Select' ? SelectFieldRenderer({
                name,
                label,
                description,
                optionValues,
                placeholder,
                className,
                disabled,
                control
            }) : type === 'RadioGroup' ? RadioGroupRenderer({
                name,
                label,
                description,
                optionValues,
                className,
                disabled,
                control
            }) : type === 'DateTimePicker' ? DateTimePickerRenderer({
                name,
                label,
                description,
                className,
                disabled,
                control
            }) : type === 'ComboBox' ? ComboBoxRenderer({
                name,
                label,
                description,
                optionValues,
                placeholder,
                className,
                disabled,
                control,
                onSelected
            }) : type === 'TextArea' ? TextAreaFieldRenderer({
                label,
                description,
                placeholder,
                className,
                disabled,
                resizable
            }) : InputFieldRenderer({
                label,
                description,
                placeholder,
                className,
                disabled,
            })}
        />
    )
}

export default FormFieldRenderer;