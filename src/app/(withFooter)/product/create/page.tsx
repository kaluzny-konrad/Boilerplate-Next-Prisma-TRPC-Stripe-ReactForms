import CreateProductForm from "@/components/Product/ProductCreateForm";
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";

export default function ProductCreatePage() {
  if (!checkRole("admin")) {
    redirect("/");
  }

  return (
    <div>
      <CreateProductForm />
    </div>
  );
}
