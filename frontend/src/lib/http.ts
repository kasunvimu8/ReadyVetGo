import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { toast } from "@/components/ui/use-toast.ts"
const baseURL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // allow authentication cookies to be sent
})

const handleResponse = <T>(response: AxiosResponse<T>) => response.data

/**
 *
 * @param error the caught error
 * @param expectedHTTPErrors record containing the Status Code and a callback function for errors that we expect
 */
const handleError = (
  error: unknown,
  expectedHTTPErrors?: Record<number, (err: AxiosError) => void>
) => {
  if (error instanceof AxiosError) {
    const errorStatus = error.response?.status
    if (expectedHTTPErrors && errorStatus && expectedHTTPErrors[errorStatus]) {
      // Error was expected, and we have a callback to handle this exact error
      expectedHTTPErrors[errorStatus](error)
    } else {
      // Unexpected error
      console.error("API call failed: ", error)

      toast({
        title: error.message,
        description:
          JSON.stringify(error?.response?.data?.message) ??
          "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  throw error
}

export const GET = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance
    .get<T>(url, config)
    .then(handleResponse)
    .catch(handleError)
}

export const POST = <T, U>(
  url: string,
  data: U,
  config?: AxiosRequestConfig,
  expectedHTTPErrors?: Record<number, (err: AxiosError) => void>
): Promise<T> => {
  return axiosInstance
    .post<T>(url, data, config)
    .then(handleResponse)
    .catch((err) => handleError(err, expectedHTTPErrors))
}

export const PUT = <T, U>(
  url: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance
    .put<T>(url, data, config)
    .then(handleResponse)
    .catch(handleError)
}

export const DELETE = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance
    .delete<T>(url, config)
    .then(handleResponse)
    .catch(handleError)
}
