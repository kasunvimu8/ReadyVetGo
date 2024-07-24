import { useEffect, useState } from "react"

// https://www.dhiwise.com/post/ultimate-guide-to-implementing-react-debounce-effectively
const useDebouncedValue = <T>(inputValue: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [inputValue, delay])

  return debouncedValue
}

export default useDebouncedValue
