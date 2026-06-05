type Props = {
    message?: string;
  };
  
  export function LoadingState({ message = "Loading..." }: Props) {
    return (
      <div className="rounded-xl border bg-white p-6 text-gray-600">
        {message}
      </div>
    );
  }