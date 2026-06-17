import PostEditor from "@/components/admin/PostEditor";
import { getAllCategories } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return <PostEditor categories={getAllCategories()} />;
}
