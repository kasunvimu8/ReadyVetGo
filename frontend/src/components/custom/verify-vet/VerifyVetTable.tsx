import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { getColumns } from "./VerifyVetTableColumns"
import { UserDocument, UserProfile } from "@/types/user"
import { getVerifyVeterinarianData, updateVetVerification } from "@/api/user"
import { useToast } from "@/components/ui/use-toast"
import { SUCCESS } from "@/constants"
import Loading from "@/components/shared/Loading"

const visibility = {
  id: true,
  email: true,
  isVerified: true,
  createdDate: true,
}

export type VetWithDocs = UserProfile & { documents?: UserDocument[] }

const VetTable = () => {
  const [vets, setVets] = useState<VetWithDocs[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const vetData = await getVerifyVeterinarianData()
      setVets(vetData)
      setLoading(false)
    })()
  }, [])

  const handleVerification = async (id: string, isVerified: boolean) => {
    const updatedVets = vets.map((vet) => {
      if (vet.id === id) {
        return { ...vet, isVerified: isVerified }
      } else {
        return vet
      }
    })

    const res = await updateVetVerification({ id, isVerified })

    if (res.status === SUCCESS) {
      setVets(updatedVets)
    }

    toast({
      title: `Verification : ${res.status === SUCCESS ? "Success" : "Failed"}`,
      description: res.message,
    })
  }

  if (loading) return <Loading />
  return (
    <DataTable
      columns={getColumns(handleVerification)}
      data={vets}
      visibility={visibility}
      filterId="email"
      filterDescription="Filter by email"
    />
  )
}

export default VetTable
