import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx"
import { componentsMap } from "@/components/custom/cms/utils/cms-component-factory.tsx"
import { capitalizeFirstLetter } from "@/lib/utils.ts"

const FormSchema = z.object({
  componentType: z.string(),
})

interface CmsNewComponentDialogProps {
  onComponentAdd: (componentType: string) => void
}

export default function CmsNewComponentDialog({
  onComponentAdd,
}: CmsNewComponentDialogProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const selectableComponents = Object.keys(componentsMap).map(
    (componentTitle) => (
      <SelectItem value={componentTitle} key={componentTitle}>
        {capitalizeFirstLetter(componentTitle)}
      </SelectItem>
    )
  )

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Pass the componentType to parent component
    onComponentAdd(data.componentType)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-8">Add components</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
            <DialogHeader>
              <DialogTitle>Add components</DialogTitle>
              <DialogDescription>
                Select a component to add to your blog post
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="componentType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{selectableComponents}</SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" disabled={!form.formState.isValid}>
                  Add component
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
