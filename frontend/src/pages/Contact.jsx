import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { FaUser, FaEnvelope, FaComment, FaPhone } from 'react-icons/fa';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_e623xt8',
      'template_vu9u0il',
      form.current,
      'IZZ59QHUXZKVGhnl6'
    ).then(
      (result) => {
        alert('Message sent successfully!');
        form.current.reset();
      },
      (error) => {
        alert('Failed to send message.');
        console.error(error.text);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <form
        ref={form}
        onSubmit={sendEmail}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Contact Us</h2>

        <div className="flex items-center gap-2 mb-4 border rounded px-3 py-2">
          <FaUser className="text-gray-500" />
          <input
            type="text"
            name="user_name"
            placeholder="Your Name"
            required
            className="w-full outline-none"
          />
        </div>

        <div className="flex items-center gap-2 mb-4 border rounded px-3 py-2">
          <FaEnvelope className="text-gray-500" />
          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            className="w-full outline-none"
          />
        </div>

        <div className="flex items-center gap-2 mb-4 border rounded px-3 py-2">
          <FaPhone className="text-gray-500" />
          <input
            type="tel"
            name="user_phone"
            placeholder="Your Number"
            required
            className="w-full outline-none"
          />
        </div>

        <div className="flex items-start gap-2 mb-6 border rounded px-3 py-2">
          <FaComment className="text-gray-500 mt-2" />
          <textarea
            name="message"
            placeholder="Your Message"
            required
            rows="4"
            className="w-full outline-none resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded hover:from-green-500 hover:to-green-700 transition font-semibold"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
