import { GET, POST } from "@/lib/http"
import { MedicalRecord, MedicalRecordPayload } from "@/types/medicalRecords"

// create a new medical record
export const createMedicalRecord = async (record: MedicalRecordPayload) =>
  POST<MedicalRecordPayload, MedicalRecordPayload>(
    "/medical-records/create",
    record
  )

// get all medical records belogs to the user
export const getMedicalRecords = async () => {
  return await GET<MedicalRecord[]>("/medical-records")
}

// get medical record
export const getMedicalRecord = async (id: string) => {
  return await GET<MedicalRecord>(`/medical-records/${id}`)
}

// get AI generated medical record data based on the chat
export const getGeneratedRecord = async (chatId: string) => {
  return await GET<MedicalRecordPayload>(`/medical-records/generate/${chatId}`)
}
