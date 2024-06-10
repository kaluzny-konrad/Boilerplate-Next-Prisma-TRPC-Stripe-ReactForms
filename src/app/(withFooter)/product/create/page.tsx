import { redirect } from "next/navigation";

import { checkRole } from "@/utils/roles";

import CreateProductForm from "@/components/Product/ProductCreateForm";

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
