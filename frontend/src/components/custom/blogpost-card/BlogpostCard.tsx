import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Loading from "@/components/shared/Loading"
import { getAllPublicCmsPages } from "@/api/cms"
import { CmsPost } from "@/components/custom/cms/models/cms-post.type"
import { Button } from "@/components/ui/button.tsx"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { LuSearch } from "react-icons/lu"
import useDebouncedValue from "@/hooks/useDebouncedValue"

const fileUploadUrl = import.meta.env.VITE_FILE_UPLOAD_URL

const BlogpostCard = () => {
  const [posts, setPosts] = useState<CmsPost[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 3)

  /* Debounce hook to only retrieve the updated query in 500ms intervals  */
  const searchQuery = useDebouncedValue(query, 500)

  useEffect(() => {
    const fetchCmsPosts = async () => {
      setLoading(true)

      try {
        const cmsPosts = await getAllPublicCmsPages(searchQuery)
        setPosts(cmsPosts)
      } catch (error) {
        console.error("Error fetching CMS posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCmsPosts()
  }, [searchQuery])

  if (loading) return <Loading />

  const isRecentPost = (lastEditedDate: Date | undefined) => {
    return lastEditedDate && new Date(lastEditedDate) > oneWeekAgo
  }

  return (
    <div className="mx-4 mt-2">
      <div className="mb-5 relative">
        <LuSearch className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Articles"
          className="w-full pl-12 bg-white h-[50px] text-xl rounded-lg"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <Card key={post.id} className="h-50 relative">
            <img
              src={
                post.thumbnailUrl
                  ? `${fileUploadUrl}/${post.thumbnailUrl}`
                  : "/no-image.jpg"
              }
              alt="Blogpost Picture"
              className="w-full object-cover rounded-lg"
            />
            {isRecentPost(post.lastEditedDate) && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                New
              </div>
            )}
            <CardContent className="py-2">
              <h3 className="text-2xl text-[#122A41] py-2">{post.title}</h3>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto">
              <div>
                <p className="text-sm font-normal text-gray-800">
                  By: {post.createdBy.firstName} {post.createdBy.lastName}
                </p>
                <p className="text-sm font-normal text-gray-400">
                  {post.lastEditedDate
                    ? new Date(post.lastEditedDate).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "-"}
                </p>
              </div>
              <Link to={`/blog/${post.relativeUrl}`}>
                <Button variant="secondary">Read</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default BlogpostCard
