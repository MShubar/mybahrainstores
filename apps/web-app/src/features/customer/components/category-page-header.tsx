import type { ReactNode } from "react";
import { PageHeader } from "./page-header";

type CategoryPageHeaderProps = {
  title: string;
  description?: string;
  count?: number;
  onBack?: () => void;
  trailing?: ReactNode;
};

export function CategoryPageHeader({
  title,
  description,
  count,
  onBack,
  trailing,
}: CategoryPageHeaderProps) {
  return (
    <PageHeader
      title={title}
      subtitle={description}
      meta={
        typeof count === "number"
          ? `${count} ${count === 1 ? "product" : "products"}`
          : undefined
      }
      onBack={onBack}
      trailing={trailing}
    />
  );
}
