import { ContactForm } from "@/features/contact/components/ContactForm";
import { Suspense } from "react";

export const metadata = {
  title: "B2B Inquiry - StopShop",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      }>
        <ContactForm />
      </Suspense>
    </div>
  );
}
