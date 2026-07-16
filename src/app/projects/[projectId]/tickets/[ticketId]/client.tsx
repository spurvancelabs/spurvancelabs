'use client';

import { useRouter } from 'next/navigation';
import TicketDetailModal from '@/components/projects/TicketDetailModal';

interface Props {
  ticketId: string;
  projectId: string;
  ticketData: Record<string, unknown>;
  projectData: { id: string; name: string; key: string };
  membersData: Array<{ id: string; role: string; user: { id: string; name: string | null; email: string } }>;
  sprintsData: Array<{ id: string; name: string; status: string }>;
}

export default function TicketDetailPageClient({
  ticketId,
  projectId,
  membersData,
  sprintsData,
}: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950">
      <TicketDetailModal
        ticketId={ticketId}
        projectId={projectId}
        onClose={() => router.back()}
        onUpdate={() => {}}
        members={membersData.map(m => ({
          id: m.id,
          user: m.user,
          role: m.role,
        }))}
        sprints={sprintsData}
      />
    </div>
  );
}
