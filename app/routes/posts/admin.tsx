import { Link, Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { getPostListings } from '../../models/posts.server'
import { requireAdminUser } from '../../session.server'

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request)
  return json<LoaderData>({ posts: await getPostListings() })
}

export default function AdminRoute() {
  const { posts } = useLoaderData<LoaderData>()
  return (
    <div className="max-w-4x1 mx-auto">
      <h1 className="text-3x1 my-6 mb-2 border-b-2 text-center">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={post.slug} className="text-blue-600 underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
