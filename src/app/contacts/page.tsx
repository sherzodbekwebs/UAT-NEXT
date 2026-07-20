import { Metadata } from 'next';
import ContactsClient from './ContactsClient';

export const metadata: Metadata = {
  title: "Aloqa | UzAuto TRAILER",
  description: "Biz bilan bog'laning. Toshkent va Samarqanddagi ofislarimiz manzillari va aloqa raqamlari.",
};

export default function ContactsPage() {
  return <ContactsClient />;
}