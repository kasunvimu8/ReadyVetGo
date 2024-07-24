import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaPaw, FaVenusMars, FaDna } from "react-icons/fa"
import { GrCluster } from "react-icons/gr"
import { MdDateRange } from "react-icons/md"
import Loading from "@/components/shared/Loading"
import { MedicalRecord } from "@/types/medicalRecords"
import PageTitle from "@/components/shared/PageTitle"
import { getMedicalRecord } from "@/api/medical-record"
import { differenceInMonths, differenceInYears } from "date-fns"
import { formatDateTime } from "@/lib/utils"

function MedicalRecordView() {
  const { recordId } = useParams()
  const [record, setRecord] = useState<MedicalRecord>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      setLoading(true)
      try {
        if (recordId) {
          const { farmer, createdBy, ...rest } =
            await getMedicalRecord(recordId)

          setRecord({
            ...rest,
            farmerName: farmer ? `${farmer.firstName} ${farmer?.lastName}` : "",
            vetName: createdBy
              ? `${createdBy.firstName} ${createdBy.lastName}`
              : "",
          })
        }
      } catch (err) {
        console.error("Cannot fetch record data!", err)
      } finally {
        setLoading(false)
      }
    }

    void fetchMedicalRecord()
  }, [recordId])

  if (loading) return <Loading />

  return (
    <div className="h-full w-full p-5 overflow-auto [contain:content]">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Medical Record" />
          <span className="text-sm font-normal text-gray-500">
            ({recordId})
          </span>
        </div>
      </div>
      <div className="mx-auto py-5">
        {record ? (
          <div className="p-4 space-y-3 bg-slate-50 rounded-lg border-dashed border-2 border-gray-200">
            <div className="p-4 flex items-center justify-between space-x-2 rounded-lg pt-5 bg-[linear-gradient(45deg,rgba(18,42,100,0.8)0%,rgba(55,150,91,0.8)100%)] text-white">
              <div className="flex items-center space-x-2 min-w-[150px]">
                <FaPaw className="text-lg" />
                <p className="text-sm font-medium">{record.animalId}</p>
              </div>
              <div className="flex items-center space-x-2 min-w-[150px]">
                <GrCluster className="text-lg" />
                <p className="text-sm font-medium">{record.species}</p>
              </div>
              <div className="flex items-center space-x-2 min-w-[150px]">
                <FaDna className="text-lg" />
                <p className="text-sm font-medium">{record.breed}</p>
              </div>
              <div className="flex items-center space-x-2 min-w-[150px]">
                <FaVenusMars className="text-lg" />
                <p className="text-sm font-medium">{record.sex}</p>
              </div>
              <div className="flex items-center space-x-2 min-w-[150px]">
                <MdDateRange className="text-lg" />
                <p className="text-sm font-medium">
                  {record.dob
                    ? (() => {
                        const years = differenceInYears(new Date(), record.dob)
                        const months =
                          differenceInMonths(new Date(), record.dob) % 12
                        return `${years} years ${months} months`
                      })()
                    : ""}
                </p>
              </div>
            </div>
            <div className="p-2 flex items-center justify-between space-x-2 rounded-lg">
              <div>
                <h2 className="font-bold">Veterinarian Name</h2>
                <p className="text-sm font-medium">{record.vetName}</p>
              </div>
              <div>
                <h2 className="font-bold">Farmer Name</h2>
                <p className="text-sm font-medium">{record.farmerName}</p>
              </div>
              <div>
                <h2 className="font-bold">Diagnosed Date</h2>
                <p className="text-sm font-medium">
                  {formatDateTime(new Date(String(record.createdDate)))}
                </p>
              </div>
            </div>
            <div className="p-2">
              <h2 className="font-bold">Assessment</h2>
              <p className="text-sm font-medium">{record.assessment}</p>
            </div>
            <div className="p-2">
              <h2 className="font-bold">Treatment</h2>
              <p className="text-sm font-medium">{record.treatment}</p>
            </div>
            <div className="p-2">
              <h2 className="font-bold">Plan</h2>
              <p className="text-sm font-medium">{record.plan}</p>
            </div>
            <div className="flex justify-end">
              <img
                src="/Logo.png"
                alt="Ready Vet Go's Logo"
                className="w-[90px]"
              />
            </div>
          </div>
        ) : (
          <p> No record found !</p>
        )}
      </div>
    </div>
  )
}

export default MedicalRecordView
