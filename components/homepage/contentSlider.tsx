import React from "react";
import { Terminal, FileText, Code2, Paintbrush, Layers, Settings2 } from "lucide-react";

const sliderItems = [
    { name: "[PROMPT CODING]", icon: Terminal },
    { name: "[RULES & CLAUDE.MD]", icon: FileText },
    { name: "[UI SNIPPET]", icon: Code2 },
    { name: "[DESIGN TOKENS]", icon: Paintbrush },
    { name: "[SYSTEM ARCHITECTURE]", icon: Layers },
    { name: "[AGENT WORKFLOWS]", icon: Settings2 },
];

export default function ContentSlider() {
    return (
        <div className="w-full bg-neutral-100 border-b border-zinc-200 overflow-hidden py-3 relative">
            
            {/* Gradien kiri dan kanan agar efek fade pada saat masuk/keluar */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-100 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-100 to-transparent z-10" />

            {/* Container animasi */}
            <div className="flex w-max animate-marquee hover:animation-paused">
                {/* 
                  Render array 2x agar animasi loop mulus 
                  (ketika bagian pertama lewat, bagian kedua menyambungnya)
                */}
                {[...Array(2)].map((_, arrayIndex) => (
                    <div key={arrayIndex} className="flex items-center px-4">
                        {sliderItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={`${arrayIndex}-${index}`} className="flex items-center">
                                    <div className="flex items-center gap-2 group">
                                        <div className="text-zinc-400 group-hover:text-indigo-600 transition-colors">
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-neutral-900 text-xs font-bold tracking-wide uppercase group-hover:text-indigo-600 transition-colors">
                                            {item.name}
                                        </span>
                                    </div>
                                    
                                    {/* Pemisah (Separator) antar item */}
                                    <span className="text-zinc-300 text-base font-normal mx-6">
                                        /
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}