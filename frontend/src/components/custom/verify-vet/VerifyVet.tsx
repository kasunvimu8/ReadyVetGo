import PageTitle from "@/components/shared/PageTitle"
import VetTable from "@/components/custom/verify-vet/VerifyVetTable"

const VerifyVet = () => {
  return (
    <div className="h-full w-full p-5 overflow-auto [contain:content]">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Verify Veterinarians" />
        </div>
      </div>
      <div className="mx-auto py-5">
        <VetTable />
      </div>
    </div>
  )
}

export default VerifyVet
