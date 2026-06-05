export function UnauthorizedPage() {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border p-8 text-center">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="mt-2 text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }