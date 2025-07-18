import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullMessage = `Subject: ${formData.subject}\n\n${formData.message}`;

    try {
      const response = await fetch('http://localhost:8000/api/contact/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: fullMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.success });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-12 font-inter">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-4">
            We'd love to hear from you! Send us a message or reach out directly.
          </p>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Address */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Address</h2>
            <p className="text-sm sm:text-base text-gray-700">
              Smart Bank 360<br />
              4th Floor, EcoBank Towers<br />
              Nairobi, Kenya
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Phone</h2>
            <a
              href="tel:0755901372"
              className="text-blue-600 hover:underline flex items-center gap-2 text-sm sm:text-base"
              title="Tap to call"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884l2-3.5A1 1 0 015 2h2a1 1 0 011 1v2a1 1 0 01-.293.707L6.414 7.414a1 1 0 000 1.414l5.586 5.586a1 1 0 001.414 0l1.707-1.707A1 1 0 0116 12h2a1 1 0 011 1v2a1 1 0 01-.384.77l-3.5 2a2 2 0 01-2.18 0C7.874 14.915 5.09 12.131 2.003 5.884z" />
              </svg>
              0755 901 372
            </a>
          </div>

          {/* Email */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Email</h2>
            <a
              href="mailto:kyalo7867@gmail.com?subject=Support%20Request"
              className="text-blue-600 hover:underline text-sm sm:text-base"
              title="Click to send an email"
            >
              support@smartbank.co.ke
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4 sm:mb-6">Send a Message</h2>

          {status && (
            <div
              className={`mb-4 sm:mb-6 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-l-4 transition-all duration-300 text-sm sm:text-base ${
                status.type === 'success'
                  ? 'bg-green-100 border-green-600 text-green-700'
                  : 'bg-red-100 border-red-600 text-red-700'
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring focus:ring-blue-200 outline-none text-sm sm:text-base"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring focus:ring-blue-200 outline-none text-sm sm:text-base"
                placeholder="you@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Subject</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring focus:ring-blue-200 outline-none text-sm sm:text-base"
                placeholder="Inquiry about services"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Message</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring focus:ring-blue-200 outline-none resize-none text-sm sm:text-base"
                placeholder="Write your message here..."
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition shadow-md text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Embedded Map */}
        <div className="w-full rounded-xl overflow-hidden shadow-md">
          <iframe
            title="Smart Bank 360 Location"
            src="https://maps.google.com/maps?q=Nairobi%20CBD&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="300"
            className="border-0 w-full"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;