import { DELETE, POST } from "@/lib/http.ts"
import { FileUploadResponse } from "@/types/file-upload.ts"

const fileUploadUrl = import.meta.env.VITE_FILE_UPLOAD_URL

export const uploadFile = async (file: File, isPublic: boolean) => {
  const formData = new FormData()
  formData.append("file", file)

  return POST<FileUploadResponse, FormData>(
    `/file-upload/${isPublic ? "public" : "private"}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      withXSRFToken: true,
      baseURL: fileUploadUrl,
    }
  )
}

export const deleteFile = async (filePath: string) => {
  return DELETE<FileUploadResponse>("/file-upload/", {
    baseURL: fileUploadUrl,
    params: { filePath: filePath },
  })
}
