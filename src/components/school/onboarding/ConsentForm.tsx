'use client'

import { useState } from 'react';
import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/form/input/Checkbox';
import Alert from '@/components/ui/alert/Alert';

interface Props {
  schoolId: string;
  onSubmit: () => void;
}

export function ConsentForm({ schoolId, onSubmit }: Props) {
  const [consent, setConsent] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!consent) {
      setAlert({ variant: "warning", message: "Please accept the consent to proceed." });
      return;
    }

    try {
      const res = await fetch(`/api/schools/${schoolId}/onboard`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent_received: true })
      });

      if (!res.ok) throw new Error('Failed');
      
      setAlert({ variant: "success", message: "Consent submitted successfully" });
      onSubmit();
    } catch {
      setAlert({ variant: "error", message: "Something went wrong" });
    }
  };

  return (
    <div className="p-4 border rounded-xl">
      <h2 className="text-xl font-bold mb-2">Consent Form</h2>

      {alert && (
        <div className="mb-4">
          <Alert variant={alert.variant}>{alert.message}</Alert>
        </div>
      )}

      <label className="flex items-center gap-2">
        <Checkbox checked={consent} onCheckedChange={val => setConsent(Boolean(val))} />
        I agree to EdAssess onboarding terms and privacy policy.
      </label>

      <Button className="mt-4" onClick={handleSubmit}>Submit Consent</Button>
    </div>
  );
}
