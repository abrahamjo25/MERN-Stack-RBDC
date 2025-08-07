import { UpdateRole } from "@/components/dashborad/roles/update-role";


export default async function Page({ searchParams }: {searchParams : Promise<{id : string}>}) {
  const id = (await searchParams)?.id;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <UpdateRole id={id!} />
        </div>
      </div>
    </div>
  );
}
