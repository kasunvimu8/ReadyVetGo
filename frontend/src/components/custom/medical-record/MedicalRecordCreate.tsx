import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaPaw, FaVenusMars, FaDna } from "react-icons/fa"
import { GrCluster } from "react-icons/gr"
import { MdDateRange } from "react-icons/md"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { differenceInMonths, differenceInYears, format } from "date-fns"
import { cn } from "@/lib/utils"
import { defaultValues, SEX } from "@/types/medicalRecords"
import { Textarea } from "@/components/ui/textarea"
import PageTitle from "@/components/shared/PageTitle"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useRef, useState } from "react"
import { createMedicalRecord, getGeneratedRecord } from "@/api/medical-record"
import Loading from "@/components/shared/Loading"
import { useNavigate, useParams } from "react-router-dom"

const formSchema = z.object({
  animalId: z.string().min(1, "Animal ID is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string(),
  sex: z.nativeEnum(SEX, { required_error: "Sex is required" }),
  dob: z.string().min(1, "Date of Birth is required"),
  color: z.string(),
  weight: z.number(),
  assessment: z.string().min(1, "Assessment is required"),
  treatment: z.string().min(1, "Treatment is required"),
  plan: z.string().min(1, "Plan is required"),
})

export default function MedicalRecordCreate() {
  // Here the record can be generated from LLM response
  const { chatId } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const loadingRef = useRef<boolean>(false)
  const farmerId = useRef<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    const fetchGeneratedRecord = async () => {
      try {
        // ref used to stop the immediate 2 nd execution (checking laoding status did not worked)
        if (chatId && !loadingRef.current) {
          setLoading(true)
          loadingRef.current = true
          const generatedRecord = await getGeneratedRecord(chatId)
          form.reset({ ...defaultValues, ...generatedRecord })
          farmerId.current = generatedRecord.farmerId

          setLoading(false)
        }
      } catch (err) {
        console.error("Cannot get generated data!", err)
        setLoading(false)
      } finally {
        loadingRef.current = false
      }
    }

    void fetchGeneratedRecord()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true)
    try {
      if (farmerId?.current) {
        const res = await createMedicalRecord({
          ...values,
          farmerId: farmerId.current,
        })
        if (res) {
          toast({
            title: "✅ Success!",
            description: "Medical record created successfully",
          })

          // TODO : After a successfully creation of a animal medical record, user should redirected to the chat page ?
          navigate("/medical-records", {
            replace: true,
          })
        }
      } else {
        toast({
          title: "Creation Failed",
          description: "Farmer data not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Medical Record Creation Failed",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const dob = useWatch({ control: form.control, name: "dob" })

  return (
    <div className="container mx-auto p-5 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Create Medical Record" />
        </div>
      </div>
      <div className="p-4 flex items-center justify-between space-x-2 bg-slate-50 rounded-lg pt-5 bg-[linear-gradient(45deg,rgba(18,42,100,0.8)0%,rgba(55,150,91,0.8)100%)] text-white">
        <div className="flex items-center space-x-2 min-w-[150px]">
          <FaPaw className="text-lg" />
          <p className="text-sm font-medium">
            {useWatch({ control: form.control, name: "animalId" })}
          </p>
        </div>
        <div className="flex items-center space-x-2 min-w-[150px]">
          <GrCluster className="text-lg" />
          <p className="text-sm font-medium">
            {useWatch({ control: form.control, name: "species" })}
          </p>
        </div>
        <div className="flex items-center space-x-2 min-w-[150px]">
          <FaDna className="text-lg" />
          <p className="text-sm font-medium">
            {useWatch({ control: form.control, name: "breed" })}
          </p>
        </div>
        <div className="flex items-center space-x-2 min-w-[150px]">
          <FaVenusMars className="text-lg" />
          <p className="text-sm font-medium">
            {useWatch({ control: form.control, name: "sex" })}
          </p>
        </div>
        <div className="flex items-center space-x-2 min-w-[150px]">
          <MdDateRange className="text-lg" />
          <p className="text-sm font-medium">
            {form.getValues("dob")
              ? (() => {
                  const dob = new Date(form.getValues("dob"))
                  const years = differenceInYears(new Date(), dob)
                  const months = differenceInMonths(new Date(), dob) % 12
                  return `${years} years ${months} months`
                })()
              : ""}
          </p>
        </div>
      </div>
      {loading && <Loading />}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-2 pt-2 space-y-1"
      >
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label>Animal ID </Label>
            <Input
              placeholder="A00000"
              className="mt-2"
              {...form.register("animalId")}
            />
            {form.formState.errors.animalId && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.animalId?.message}
              </p>
            )}
          </div>
          <div>
            <Label>Species</Label>
            <Input
              placeholder="Bovine"
              className="mt-2"
              {...form.register("species")}
            />
            {form.formState.errors.species && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.species?.message}
              </p>
            )}
          </div>
          <div>
            <Label>Breed</Label>
            <Input
              placeholder="Holstein"
              className="mt-2"
              {...form.register("breed")}
            />
          </div>
          <div>
            <Label>Color</Label>
            <Input
              placeholder="Black"
              className="mt-2"
              {...form.register("color")}
            />
          </div>
          <div>
            <Label>Weight (Kg)</Label>
            <Input
              placeholder="150"
              className="mt-2"
              type="number"
              {...form.register("weight", { valueAsNumber: true })}
            />
          </div>
          <div>
            <Label>Sex</Label>
            <div className="mt-2">
              <Select
                onValueChange={(value) => form.setValue("sex", value as SEX)}
                defaultValue={SEX.male}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SEX" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={SEX.male}>Male</SelectItem>
                    <SelectItem value={SEX.female}>Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {form.formState.errors.sex && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.sex?.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>DOB</Label>
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dob && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dob ? (
                      format(new Date(dob), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dob ? new Date(dob) : undefined}
                    onSelect={(date) => {
                      form.setValue("dob", date ? date.toISOString() : "")
                    }}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={2015}
                    toDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.dob && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.dob?.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="pt-2 items-center justify-start space-y-2">
          <Label>Assessment</Label>
          <Textarea
            id="assessment"
            rows={3}
            placeholder="Details about the assessment conducted"
            {...form.register("assessment")}
          />
          {form.formState.errors.assessment && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.assessment?.message}
            </p>
          )}
        </div>
        <div className="pt-2 items-center justify-start space-y-2">
          <Label>Treatments</Label>
          <Textarea
            id="treatment"
            rows={3}
            placeholder="Type specified treatments details"
            {...form.register("treatment")}
          />
          {form.formState.errors.treatment && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.treatment?.message}
            </p>
          )}
        </div>
        <div className="pt-2  items-center justify-start space-y-2">
          <Label>Plan</Label>
          <Textarea
            id="plan"
            rows={3}
            placeholder="Provide what to do if the diagnostics are remain in the future"
            {...form.register("plan")}
          />
          {form.formState.errors.plan && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.plan?.message}
            </p>
          )}
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" className="self-end">
            <span className="px-2">Create</span>
            {saving && <Loading />}
          </Button>
        </div>
      </form>
    </div>
  )
}
