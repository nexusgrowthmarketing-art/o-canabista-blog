import PostEditor from "@/components/admin/PostEditor";
import { getAllCategories } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const categories = await getAllCategories();
  return <PostEditor categories={categories} />;
}
