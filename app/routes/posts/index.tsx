import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { getPostListings } from '../../models/posts.server'
import { useOptionalAdminUser } from '../../utils'

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>
}

export const loader: LoaderFunction = async () => {
  const posts = await getPostListings()
  return json<LoaderData>({ posts })
}
export default function PostsRoute() {
  const { posts } = useLoaderData<LoaderData>()
  const adminUser = useOptionalAdminUser()

  return (
    <main>
      <h1>Posts</h1>
      {adminUser ? (
        <Link className="text-red-600 underline" to="admin">
          Admin
        </Link>
      ) : null}
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
