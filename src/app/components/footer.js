
"use client"
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
const footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and description */}
        <div>
          <Image
            src="/logo.png"
            alt="LOGO"
            width={40}
            height={40}
            priority
            className='m-1' />
          <div className="leading-relaxed flex flex-col">
            <h1 className='text-2xl'>Evolvia</h1>
            <h1 className='text-sm'>Navigate | Learn | Achieve</h1>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/services" className="hover:underline">Citizen Services</a></li>
            <li><a href="/departments" className="hover:underline">Departments</a></li>
            <li><a href="/schemes" className="hover:underline">Government Schemes</a></li>
            <li><a href="/contact" className="hover:underline">Contact Directory</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Resources</h3>
          <ul className="space-y-2 text-sm" >
            <li><a href="/faq" className="hover:underline">FAQs</a></li>
            <li><a href="/downloads" className="hover:underline">Forms & Downloads</a></li>
            <li><a href="/grievance" className="hover:underline">Grievance Redressal</a></li>
            <li><a href="/feedback" className="hover:underline">Feedback</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Contact</h3>
          <p className="text-sm">
            Civil Secretariat, Jammu & Kashmir <br />
            Phone: +91-XXXXXXXXXX <br />
            Email: support@jk.gov.in
          </p>
          <div className="flex space-x-4 mt-3">
            <a href="https://twitter.com/" aria-label="Twitter" className="hover:text-blue-600">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M..." /></svg>
            </a>
            {/* Add other social icons similarly */}
          </div>
        </div>
        <div className="bg-[#0F172A] py-4 ml-120 text-sm text-white w-full flex items-center justify-center whitespace-nowrap gap-2">
          <span>© {new Date().getFullYear()} Evolvia</span>
          <span className="mx-1">|</span>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span className="mx-1">|</span>
          <Link href="/terms" className="hover:underline">Terms of Use</Link>
          <span className="mx-1">|</span>
          <Link href="/accessibility" className="hover:underline">Accessibility</Link>
        </div>
      </div>

      {/* Bottom bar */}

    </footer>
  );
}

export default footer
