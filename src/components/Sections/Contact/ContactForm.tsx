import emailjs from '@emailjs/browser';
import { FC, memo, useCallback, useMemo, useState } from 'react';

import ContactModal from './ContactModal';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC = memo(() => {
  const defaultData = useMemo(
    () => ({
      name: '',
      email: '',
      message: '',
    }),
    [],
  );

  const [data, setData] = useState<ContactFormData>(defaultData);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onChange = useCallback(
    <T extends HTMLInputElement | HTMLTextAreaElement>(event: React.ChangeEvent<T>): void => {
      const { name, value } = event.target;

      const fieldData: Partial<ContactFormData> = { [name]: value };

      setData({ ...data, ...fieldData });
    },
    [data],
  );

  const handleSendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        await emailjs.send(
          'contact-form',
          'contact_form',
          { from_name: data.name, message: data.message, user_email: data.email },
          { publicKey: process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY },
        );
        setShowModal(true);
      } catch (err) {
        setShowModal(true);
        console.error(err);
      }

      setData({
        name: '',
        email: '',
        message: '',
      });
    },
    [data.email, data.message, data.name],
  );

  const clearModal = useCallback(() => {
    setData({
      name: '',
      email: '',
      message: '',
    });
    setShowModal(false);
  }, []);

  const inputClasses =
    'bg-neutral-700 border-0 focus:border-0 focus:outline-none focus:ring-1 focus:ring-orange-600 rounded-md placeholder:text-neutral-400 placeholder:text-sm text-neutral-200 text-sm';

  return showModal ? (
    <ContactModal clearModal={clearModal} showModal={showModal} />
  ) : (
    <form className="grid min-h-[320px] grid-cols-1 gap-y-4" method="POST" onSubmit={handleSendMessage}>
      <input className={inputClasses} name="name" onChange={onChange} placeholder="Name" required type="text" />
      <input
        autoComplete="email"
        className={inputClasses}
        name="email"
        onChange={onChange}
        placeholder="Email"
        required
        type="email"
      />
      <textarea
        className={inputClasses}
        maxLength={250}
        name="message"
        onChange={onChange}
        placeholder="Message"
        required
        rows={6}
      />
      <button
        aria-label="Submit contact form"
        className="w-max rounded-full border-2 border-orange-600 bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-md outline-none hover:bg-stone-800 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-stone-800"
        type="submit">
        Send Message
      </button>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;
