import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getAllCategories, getAnyPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getAnyPostBySlug(slug);
  if (!post) notFound();

  return <PostEditor post={post} categories={getAllCategories()} />;
}
