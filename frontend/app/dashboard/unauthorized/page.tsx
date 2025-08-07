

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-700 mb-6">
          You don&apos;t have permission to view this page.
        </p>

      </div>
    </div>
  );
}
