'use client'

import { useEffect, useState } from 'react';

interface Props {
  schoolId: string;
}

export function CertificationStatus({ schoolId }: Props) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/schools/status/${schoolId}`)
      .then(res => res.json())
      .then(setStatus)
      .catch(() => {
        setStatus({ error: true });
      });
  }, [schoolId]);

  if (!status) return <p>Loading...</p>;
  if (status.error) return <p className="text-red-600">Failed to load status.</p>;

  return (
    <div className="mt-6 p-4 border rounded-xl">
      <h2 className="text-xl font-bold mb-2">Certification Status</h2>
      <p>Consent Received: {status.consent_received ? 'Yes' : 'No'}</p>
      <p>Audit Score: {status.audit_score ?? 'N/A'}%</p>
      <p>Certification Status: {status.certified ? 'Certified ✅' : 'Not Certified ❌'}</p>
    </div>
  );
}
