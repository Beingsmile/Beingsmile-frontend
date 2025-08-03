import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We’d love to hear from you! Fill out the form or reach us using the
            details below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Message</label>
              <textarea
                rows="5"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <section className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-10 rounded-xl shadow-md">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Contact Info */}
        <div className="space-y-6 text-sm sm:text-base bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow">
          {/* Office */}
          <div className="flex items-start gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
            <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 mt-1 text-xl" />
            <div>
              <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">Our Office</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Beingsmile Office, 444/4 Kuratoli, Khilkhet, Dhaka 1229, Bangladesh
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
            <FaEnvelope className="text-blue-600 dark:text-blue-400 mt-1 text-xl" />
            <div>
              <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">Email</h2>
              <a
                href="mailto:support@example.com"
                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                support@example.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
            <FaPhone className="text-blue-600 dark:text-blue-400 mt-1 text-xl" />
            <div>
              <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">Phone</h2>
              <p className="text-gray-600 dark:text-gray-300">+880 1234 567 890</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-4">
            <FaClock className="text-blue-600 dark:text-blue-400 mt-1 text-xl" />
            <div>
              <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">Business Hours</h2>
              <p className="text-gray-600 dark:text-gray-300">Sunday - Thursday: 9:00 AM - 5:00 PM</p>
              <p className="text-gray-600 dark:text-gray-300">Friday - Saturday: Closed</p>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
          <iframe
            title="Beingsmile Office Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.6323724468167!2d90.4240454154327!3d23.796823684561364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7bcce3f683f%3A0x39653966f1db5157!2sKuratoli%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1692282350000!5m2!1sen!2sbd"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full border-none"
          ></iframe>
        </div>
      </div>
    </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
