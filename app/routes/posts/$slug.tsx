import type { LoaderFunction } from '@remix-run/server-runtime'
import { getPost } from '../../models/posts.server'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { marked } from 'marked'
import invariant from 'tiny-invariant'

type LoaderData = {
  title: string
  html: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params
  invariant(slug, 'slug is required')
  const post = await getPost(slug)
  invariant(post, `post is not found ${slug}`)
  const html = marked(post.markdown)
  return json<LoaderData>({ title: post.title, html })
}

export default function PostRoute() {
  const { title, html } = useLoaderData<LoaderData>()
  return (
    <main className="max-w-4x1 mx-auto">
      <h1 className="text-3x1 my-6 border-b-2 text-center">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
