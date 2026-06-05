type Props = {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
  };
  
  export function EmptyState({ title, description, action, icon }: Props) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        {icon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            {icon}
          </div>
        )}
  
        <h2 className="text-xl font-bold">{title}</h2>
  
        {description && (
          <p className="mx-auto mt-2 max-w-md text-gray-600">{description}</p>
        )}
  
        {action && <div className="mt-6">{action}</div>}
      </div>
    );
  }