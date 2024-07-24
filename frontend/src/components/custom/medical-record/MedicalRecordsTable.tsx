import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table/DataTable"
import Loading from "@/components/shared/Loading"
import { MedicalRecord } from "@/types/medicalRecords"
import { getMedicalRecords } from "@/api/medical-record"
import { getColumns } from "@/components/custom/medical-record/MedicalRecordsTableColumns"
import { useNavigate } from "react-router-dom"

const visibility = {
  id: true,
  animalId: true,
  createdby: true,
  createdDate: true,
  species: true,
  sex: false,
  vetId: false,
  farmerId: false,
}

const MedicalRecordsTable = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const records = await getMedicalRecords()
      const proccessedRecords = records.map((record) => {
        const { farmer, createdBy, ...rest } = record
        return {
          ...rest,
          farmerName: farmer ? `${farmer.firstName} ${farmer?.lastName}` : "",
          vetName: createdBy
            ? `${createdBy.firstName} ${createdBy.lastName}`
            : "",
        }
      })

      setRecords(proccessedRecords)
      setLoading(false)
    })()
  }, [])

  // TODO: navigate to the chat handle
  const handleOnclick = (id: string) => {
    navigate(`/medical-records/${id}`, {
      replace: true,
    })
  }
  if (loading) return <Loading />
  return (
    <DataTable
      columns={getColumns(handleOnclick)}
      data={records}
      visibility={visibility}
      filterId="animalId"
      filterDescription="Filter by animal id"
    />
  )
}

export default MedicalRecordsTable
