'use client';
import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  FaFileAlt, FaTachometerAlt, FaBars, FaPhone, FaChartPie, FaUserTie,
  FaStore, FaCrown, FaTrophy, FaStar, FaGem, FaMagic, FaRocket, FaCog, FaCopy, FaChevronDown
} from 'react-icons/fa';
import ForcaAutenticacao from '@/components/autenticacao/ForcarAutenticacao';

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  premium?: boolean;
  exclusive?: boolean;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
  color: string;
  icon: React.ReactNode;
}

const NavigationButtons: React.FC = memo(() => {
  const baseUrl = 'https://despachantebetodehon.vercel.app';
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);

  const toggleSection = (section: string) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const copyToClipboard = async (path: string) => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}${path}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const menuSections: MenuSection[] = [
    {
      section: 'Parcelamento TB',
      color: 'from-emerald-700 to-teal-800',
      icon: <FaRocket className="text-2xl" />,
      items: [
        { href: '/multcrm/parcelamento', icon: <FaFileAlt />, label: 'CRM Parcelamento Tubarão', premium: true },
        { href: '/addcontato/parcelamento', icon: <FaTachometerAlt />, label: 'Adicionar Contatos em Massa', premium: true, exclusive: true },
      ],
    },
  ];

  return (
    <ForcaAutenticacao>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-['Inter', 'sans-serif']">
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-2xl"
          >
            <FaGem className="inline mr-2" />
            Link copiado com sucesso!
          </motion.div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-700 to-teal-800 rounded-full shadow-2xl mb-6"
            >
              <FaCrown className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Despachante Beto Dehon</h1>
            <p className="text-lg text-gray-600 font-medium">Soluções premium com excelência e sofisticação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="rounded-3xl border border-gray-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div
                  className={`p-6 bg-gradient-to-r ${section.color} text-white flex items-center justify-between rounded-t-3xl cursor-pointer`}
                  onClick={() => toggleSection(section.section)}
                >
                  <div className="flex items-center gap-4 text-xl font-semibold tracking-tight">
                    {section.icon}
                    {section.section}
                  </div>
                  <FaChevronDown className={`transition-transform duration-300 ${expandedSections[section.section] ? 'rotate-180' : ''}`} />
                </div>

                {expandedSections[section.section] && (
                  <div className="p-6 space-y-4">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <a
                          href={item.href}
                          className="flex items-center gap-4 flex-1 px-5 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 hover:border-emerald-600 transition-all duration-300"
                        >
                          <span className="text-2xl text-emerald-700">{item.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-800 text-base tracking-tight">{item.label}</p>
                            <div className="text-sm mt-2 flex gap-2">
                              {item.premium && (
                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                                  <FaGem className="text-xs" /> Premium
                                </span>
                              )}
                              {item.exclusive && (
                                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                                  <FaTrophy className="text-xs" /> Exclusivo
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                        <button
                          onClick={() => copyToClipboard(item.href)}
                          className="p-3 bg-gray-100 hover:bg-emerald-600 text-gray-600 hover:text-white rounded-xl transition-all duration-300"
                        >
                          <FaCopy size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center text-sm text-gray-500 font-medium">
            <p className="inline-flex items-center gap-2">
              <FaTrophy className="text-emerald-600" />
              © 2025 Despachante Beto Dehon – Todos os direitos reservados
              <FaTrophy className="text-emerald-600" />
            </p>
          </div>
        </div>
      </div>
    </ForcaAutenticacao>
  );
});

NavigationButtons.displayName = 'NavigationButtons';
export default NavigationButtons;
