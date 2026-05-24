import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { OpsPanel } from "@/components/ops";

export default async function OpsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen text-zinc-200 animate-page-enter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-[10px] text-zinc-700 tracking-widest uppercase">era-os</span>
            <span className="font-mono text-xs text-zinc-700">// ops</span>
          </div>
          <h1 className="terminal-heading font-mono text-3xl font-bold text-zinc-100 tracking-tight">
            OPERATIONS
          </h1>
          <p className="font-mono text-sm text-zinc-500 mt-2 ml-6">
            Operational workspace · quick notes, commands, references
          </p>
        </header>

        <OpsPanel />
      </main>
    </div>
  );
}
