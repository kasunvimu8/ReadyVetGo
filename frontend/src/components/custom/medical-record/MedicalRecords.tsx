import PageTitle from "@/components/shared/PageTitle"
import MedicalRecordsTable from "@/components/custom/medical-record/MedicalRecordsTable"

const MedicalRecords = () => {
  return (
    <div className="h-full w-full p-5 overflow-auto [contain:content]">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Medical Records History" />
        </div>
      </div>
      <div className="mx-auto py-5">
        <MedicalRecordsTable />
      </div>
    </div>
  )
}

export default MedicalRecords
