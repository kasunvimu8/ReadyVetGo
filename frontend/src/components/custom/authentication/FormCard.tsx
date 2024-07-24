import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ReactElement, ReactNode } from "react";
import Loading from "@/components/shared/Loading.tsx";

interface FormComponentProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  title: string;
  description: string;
  header?: ReactNode;
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    autoComplete: string;
    id: string;
    ariaRequired: boolean;
    fieldFooter?: ReactElement;
  }>;
  submitButtonText?: string;
  footer?: ReactNode;
  isLoading?: boolean;
}

/**
 * A card component for displaying a form with customizable header, fields, and footer.
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.form - The form configuration object used with react-hook-form.
 * @param {Function} props.onSubmit - The function to handle form submission.
 * @param {string} props.title - The title displayed on the form card.
 * @param {string} props.description - The description displayed below the title.
 * @param {React.ReactNode} [props.header] - Optional header content to be displayed above the form fields.
 * @param {Array} props.fields - Array of field configurations for the form inputs.
 * @param {string} props.fields[].name - The name of the form field.
 * @param {string} props.fields[].label - The label of the form field.
 * @param {string} [props.fields[].type="text"] - The type of the form input.
 * @param {string} [props.fields[].autoComplete] - The autoComplete attribute for the input.
 * @param {string} props.fields[].id - The id of the form input.
 * @param {boolean} [props.fields[].ariaRequired] - The aria-required attribute for the input.
 * @param {React.ReactNode} [props.fields[].fieldFooter] - Optional footer content for each form field.
 * @param {string} [props.submitButtonText="Submit"] - The text displayed on the submit button.
 * @param {React.ReactNode} [props.footer] - Optional footer content to be displayed below the submit button.
 * @param {boolean} [props.isLoading] - Flag to indicate if the form is a login form.
 * @example
 * <FormCard
 *   form={form}
 *   onSubmit={handleSubmit}
 *   title="Login"
 *   description="Please enter your credentials"
 *   fields={[
 *     {name: "email", label: "Email", autoComplete: "email", id: "email", ariaRequired: true},
 *     {name: "password", label: "Password", type: "password", autoComplete: "password", id: "password", ariaRequired: true}
 *   ]}
 * />
 */
const FormCard = ({
                    form,
                    onSubmit,
                    title,
                    description,
                    header,
                    fields,
                    submitButtonText,
                    footer,
                    isLoading,
                  }: FormComponentProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {header}
          {fields.map(({
                         name, label, type = "text", autoComplete,
                         id, ariaRequired, fieldFooter
                       }, index) => (
           // encountered a duplicate key error, causing trouble with the form, so set the key manually
            <CardContent key={`${name}-${index}`}>
              <FormField
                control={form.control}
                name={name}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input id={id} autoComplete={autoComplete} type={type} {...field} aria-required={ariaRequired}/>
                    </FormControl>
                    <FormMessage/>
                    {fieldFooter}
                  </FormItem>
                )}
              />
            </CardContent>
          ))}
          <CardContent>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <div className="absolute flex items-center right-14">
                <Loading/>
              </div>}
              {submitButtonText || title}
            </Button>
            {footer}
          </CardContent>

        </form>
      </Form>
    </Card>
  );
};

export default FormCard;