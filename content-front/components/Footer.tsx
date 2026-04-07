import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0f172a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">YourBrand</h3>
            <p className="text-sm text-[#cbd5e1] mb-4 leading-relaxed">
              AI-powered content creation and SEO optimization tools for modern businesses.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#6C5CE7] transition-colors flex items-center justify-center text-sm font-bold">
                f
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#1da1f2] transition-colors flex items-center justify-center text-sm font-bold">
                𝕏
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#00b894] transition-colors flex items-center justify-center text-sm font-bold">
                in
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#1e293b] hover:bg-[#fd79a8] transition-colors flex items-center justify-center">
                📷
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-base font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-base font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail size={18} className="text-[#6C5CE7] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#cbd5e1]">support@yourbrand.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={18} className="text-[#1da1f2] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#cbd5e1]">+1 (555) 000-0000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-[#00b894] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#cbd5e1]">123 Business Ave, City, ST 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1e293b] my-8"></div>

        {/* Bottom Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-sm text-[#64748b]">
            © 2026 YourBrand. All rights reserved.
          </p>
          <div className="flex gap-6 md:justify-end">
            <a href="#" className="text-sm text-[#64748b] hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-[#64748b] hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-[#64748b] hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}