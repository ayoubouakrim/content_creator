import { useState } from "react";

export default function Navbar() {
    const [activeNav, setActiveNav] = useState("home");

    const navItems = [
        {
            id: "home", label: "Home",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>,
        },
        {
            id: "create", label: "Create",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
        },
        {
            id: "calendar", label: "Calendar",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
        },
        {
            id: "analytics", label: "Analytics",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
        },
        {
            id: "trends", label: "Trends",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" /></svg>,
        },
        {
            id: "brand", label: "Brand Kit",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>,
        },
    ];

    return (
        <nav
            className="flex items-center px-6 h-[60px] gap-1 sticky top-0 z-[100] flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#1a1040 0%,#2d1b69 100%)" }}
        >
            {/* Logo */}
            <div
                className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center mr-5 flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)" }}
            >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9Q9 4 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <path d="M4 12Q9 7 14 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <circle cx="14" cy="13" r="3" fill="white" />
                    <path d="M12.8 13l.9.9 1.5-1.8" stroke="#6C5CE7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Nav items */}
            <div className="flex items-center gap-0.5 flex-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                        className={`relative flex items-center gap-[7px] px-3.5 py-2 rounded-[10px] border-none cursor-pointer font-[Sora,sans-serif] text-[13px] font-semibold transition-all duration-200
                  ${activeNav === item.id
                                ? "bg-[rgba(108,92,231,0.25)] text-white"
                                : "bg-transparent text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[rgba(255,255,255,0.75)]"
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2.5 ml-auto">
                <button className="w-9 h-9 rounded-[10px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] flex items-center justify-center cursor-pointer text-[rgba(255,255,255,0.6)]">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                </button>

                <div
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white cursor-pointer flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#fd79a8,#6C5CE7)" }}
                >
                    JD
                </div>
            </div>
        </nav>
    );
}