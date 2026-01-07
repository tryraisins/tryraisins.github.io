import React, { useState } from 'react';
import SectionTitle from '../utils/sectionTitle';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('https://formsubmit.co/ajax/tryraisins@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: 'New message from your portfolio',
          _template: 'table',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('Form submission failed:', result);
        setStatus('error');
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatus('error');
    }
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] as const // Add "as const"
    },
  },
};
  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden section-container"
      style={{ background: 'var(--obsidian-900)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 atmosphere-gradient" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-24 left-[10%] w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(91, 141, 239, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-[8%] w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 74, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className="container mx-auto max-w-2xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <SectionTitle>Get In Touch</SectionTitle>

        <motion.p
          variants={itemVariants}
          className="text-center text-lg mb-12"
          style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
        >
          Have a question or want to work together? Feel free to reach out!
        </motion.p>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="p-8 md:p-10 rounded-3xl glass-card"
        >
          {/* Hidden FormSubmit fields */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://yourdomain.com/thanks" />

          {/* Name Field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-3.5 px-5 rounded-xl text-base transition-all duration-300 focus:ring-2 focus:ring-[#ff6b4a]"
              style={{
                fontFamily: "'Manrope', sans-serif",
                background: 'var(--obsidian-700)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
              }}
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-3.5 px-5 rounded-xl text-base transition-all duration-300 focus:ring-2 focus:ring-[#ff6b4a]"
              style={{
                fontFamily: "'Manrope', sans-serif",
                background: 'var(--obsidian-700)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
              }}
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Message Field */}
          <div className="mb-8">
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-secondary)' }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full py-3.5 px-5 rounded-xl text-base transition-all duration-300 resize-y min-h-[140px] focus:ring-2 focus:ring-[#ff6b4a]"
              style={{
                fontFamily: "'Manrope', sans-serif",
                background: 'var(--obsidian-700)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
              }}
              placeholder="Your message here..."
              required
            />
          </div>

          {/* Submit Button & Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={status === 'submitting'}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{ opacity: status === 'submitting' ? 0.7 : 1 }}
            >
              {status === 'submitting' ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⟳
                  </motion.span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: '#34d399' }}
              >
                <CheckCircle size={18} />
                <span>Message sent successfully!</span>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: '#fb7185' }}
              >
                <AlertCircle size={18} />
                <span>Failed to send. Please try again.</span>
              </motion.div>
            )}
          </div>
        </motion.form>
      </motion.div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
};

export default Contact;