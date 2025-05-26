import { AuditChecklist } from "@/components/school/onboarding/AuditChecklist";
import { CertificationStatus } from "@/components/school/onboarding/CertificationStatus";
import { ConsentForm } from "@/components/school/onboarding/ConsentForm";


export default function OnboardingPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">School Onboarding & Certification</h1>
      <ConsentForm />
      <AuditChecklist />
      <CertificationStatus />
    </div>
  )
}
