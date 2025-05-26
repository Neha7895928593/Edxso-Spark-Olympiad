'use client'

import { useState } from 'react';
import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/form/input/Checkbox';
import Alert from '@/components/ui/alert/Alert';

interface Props {
  schoolId: string;
  onSubmit: () => void;
}

const checklistItems = [
  "Stable Internet Connection",
  "Functional Laptops or Tablets",
  "Safe Digital Learning Environment",
  "Active IT Support Staff"
];

export function AuditChecklist({ schoolId, onSubmit }: Props) {
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const [checkedItems, setCheckedItems] = useState<boolean[]>(Array(checklistItems.length).fill(false));

  const handleToggle = (index: number) => {
    const newItems = [...checkedItems];
    newItems[index] = !newItems[index];
    setCheckedItems(newItems);
  };

  const handleSubmit = async () => {
    const score = (checkedItems.filter(Boolean).length / checklistItems.length) * 100;
    const certified = score >= 80;

    try {
      const res = await fetch(`/api/schools/${schoolId}/onboard`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit_score: score, certified })
      });
      if (!res.ok) throw new Error();

      setAlert({ variant: "success", message: "Audit submitted successfully" });
      onSubmit();
    } catch {
      setAlert({ variant: "error", message: "Audit submission failed" });
    }
  };

  return (
    <div className="p-4 border rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-2">Technical Audit</h2>

      {alert && (
        <div className="mb-4">
          <Alert variant={alert.variant}>{alert.message}</Alert>
        </div>
      )}

      {checklistItems.map((item, i) => (
        <label key={i} className="flex items-center gap-2">
          <Checkbox checked={checkedItems[i]} onCheckedChange={() => handleToggle(i)} />
          {item}
        </label>
      ))}

      <Button className="mt-4" onClick={handleSubmit}>Submit Audit</Button>
    </div>
  );
}
