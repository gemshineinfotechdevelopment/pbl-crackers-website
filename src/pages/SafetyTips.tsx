import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserHeader from "@/components/layout/UserHeader";
import UserFooter from "@/components/layout/UserFooter";
import { 
  ShieldCheck, 
  AlertOctagon, 
  Flame, 
  Droplets, 
  HeartPulse, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  Info, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight, 
  Eye, 
  ZapOff, 
  Smile
} from "lucide-react";

const SafetyTips = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'dos' | 'donts' | 'types' | 'firstaid'>('all');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF2] font-sans text-[#1F2937]">
      <UserHeader />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1E40AF] text-white pt-12 pb-16 px-4 border-b border-amber-300/20">
        {/* Glow & Sparkle accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#FFD400]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFD400] text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PBL Fireworks • Official Safety Manual</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight font-display mb-4">
            Safe Celebrations, <span className="text-[#FFD400]">Timeless Joy</span>
          </h1>

          <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Diwali sparkles brighter when celebrated with responsibility. Follow our Sivakasi certified safety protocols to ensure 100% harm-free happiness for your loved ones.
          </p>

          {/* Emergency Quick Hotlines */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 max-w-3xl mx-auto shadow-lg">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#FFD400] mb-2 flex items-center justify-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency 24x7 Direct Helplines</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
              <a 
                href="tel:101" 
                className="bg-red-600/90 hover:bg-red-600 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-sm"
              >
                <Flame className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-red-200 leading-tight">Fire Brigade</span>
                  <span className="block text-sm font-black tracking-wider leading-none">101</span>
                </div>
              </a>
              <a 
                href="tel:108" 
                className="bg-emerald-600/90 hover:bg-emerald-600 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-sm"
              >
                <HeartPulse className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-emerald-200 leading-tight">Ambulance</span>
                  <span className="block text-sm font-black tracking-wider leading-none">108</span>
                </div>
              </a>
              <a 
                href="tel:100" 
                className="bg-blue-600/90 hover:bg-blue-600 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-blue-200 leading-tight">Police</span>
                  <span className="block text-sm font-black tracking-wider leading-none">100</span>
                </div>
              </a>
              <a 
                href="tel:112" 
                className="bg-amber-600/90 hover:bg-amber-600 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-sm"
              >
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-amber-200 leading-tight">National SOS</span>
                  <span className="block text-sm font-black tracking-wider leading-none">112</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-10 max-w-6xl flex-1">
        
        {/* Modern Filter Pill Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 bg-white border border-amber-200/80 p-2 rounded-2xl shadow-sm max-w-3xl mx-auto">
          {[
            { id: 'all', label: 'All Guidelines' },
            { id: 'dos', label: "Golden Do's", icon: CheckCircle2, activeClass: 'bg-emerald-600 text-white' },
            { id: 'donts', label: "Strict Don'ts", icon: XCircle, activeClass: 'bg-rose-600 text-white' },
            { id: 'types', label: 'Cracker Guide', icon: Sparkles, activeClass: 'bg-[#2563EB] text-white' },
            { id: 'firstaid', label: 'First Aid Care', icon: HeartPulse, activeClass: 'bg-amber-600 text-white' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  isActive
                    ? (tab.activeClass || 'bg-gray-900 text-white shadow-md')
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION 1: DO'S vs DON'TS Side-by-Side (Visible on 'all', 'dos', or 'donts') */}
        {(activeTab === 'all' || activeTab === 'dos' || activeTab === 'donts') && (
          <div className="mb-14">
            <div className="text-center mb-8">
              <span className="text-[#2563EB] font-black text-xs uppercase tracking-widest block mb-1">
                Essential Ground Rules
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                The Golden Rules of Fireworks
              </h2>
              <div className="w-12 h-1 bg-[#2563EB] mx-auto mt-2 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              
              {/* DO's COLUMN */}
              {(activeTab === 'all' || activeTab === 'dos') && (
                <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-md flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-emerald-100">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 block">Safety Protocol</span>
                      <h3 className="text-xl font-extrabold text-emerald-950 font-display">The Golden Do's</h3>
                    </div>
                    <span className="ml-auto bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full">
                      6 Key Practices
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      {
                        num: "01",
                        title: "Buy Legitimate Branded Fireworks",
                        desc: "Always buy from authorized Sivakasi suppliers like PBL Crackers with green firework certification and clear usage directions."
                      },
                      {
                        num: "02",
                        title: "Use Open Outdoor Spaces Only",
                        desc: "Ignite crackers on flat, dry concrete or barren ground away from trees, parked vehicles, dry grass, and overhead cables."
                      },
                      {
                        num: "03",
                        title: "Keep Two Water Buckets Handy",
                        desc: "Always have two large buckets filled with water and wet sand nearby for instant cooling and emergencies."
                      },
                      {
                        num: "04",
                        title: "Light at Arm’s Length with Agarbatti",
                        desc: "Use long incense sticks (agarbatti) to light fuses from a safe arm's length. Never bend your face or body directly over the item."
                      },
                      {
                        num: "05",
                        title: "Wear Fitted Cotton Clothes & Shoes",
                        desc: "Wear thick cotton clothing and hard-soled footwear. Avoid loose dupattas, synthetic materials, and bare feet."
                      },
                      {
                        num: "06",
                        title: "Soak Burnt Crackers Thoroughly",
                        desc: "Used sparkler wires, flowerpots, and aerial cases stay intensely hot. Submerge them completely in water before throwing into bins."
                      }
                    ].map(item => (
                      <div 
                        key={item.num}
                        className="bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 transition-all flex items-start gap-3"
                      >
                        <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {item.num}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-sm text-emerald-950 mb-0.5">
                            {item.title}
                          </h4>
                          <p className="text-xs text-emerald-900/80 font-medium leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DON'TS COLUMN */}
              {(activeTab === 'all' || activeTab === 'donts') && (
                <div className="bg-white border-2 border-rose-500/30 rounded-3xl p-5 sm:p-7 shadow-md flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-rose-100">
                    <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-rose-600 block">Danger Warning</span>
                      <h3 className="text-xl font-extrabold text-rose-950 font-display">Crucial Don'ts</h3>
                    </div>
                    <span className="ml-auto bg-rose-100 text-rose-800 text-[11px] font-black px-2.5 py-1 rounded-full">
                      Strictly Avoid
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      {
                        num: "01",
                        title: "Never Let Young Children Light Solos",
                        desc: "Children under 12 must never ignite crackers alone. Always ensure active adult supervision within arm's reach."
                      },
                      {
                        num: "02",
                        title: "Never Try to Relight a 'Dud'",
                        desc: "If a firework fails to ignite, never lean over or pick it up immediately. Wait 20 minutes and pour water over it."
                      },
                      {
                        num: "03",
                        title: "Never Hold Fireworks in Hand",
                        desc: "Never burst crackers, atom bombs, or aerial shells while holding them in your hands or tossing them into the air."
                      },
                      {
                        num: "04",
                        title: "Never Place in Metal Tins or Glass Bottles",
                        desc: "Placing crackers inside metal boxes, cans, or bottles turns them into deadly shrapnel bombs. Strictly prohibited."
                      },
                      {
                        num: "05",
                        title: "Never Carry Crackers in Pockets",
                        desc: "Friction or body heat can trigger premature ignition. Never carry loose crackers or matchboxes inside pockets."
                      },
                      {
                        num: "06",
                        title: "Never Aim Towards People, Pets or Homes",
                        desc: "Never point rockets, roman candles, or fountains at crowds, neighbors' balconies, or domestic animals."
                      }
                    ].map(item => (
                      <div 
                        key={item.num}
                        className="bg-rose-50/60 hover:bg-rose-50 border border-rose-100 rounded-2xl p-3.5 transition-all flex items-start gap-3"
                      >
                        <span className="w-7 h-7 rounded-lg bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {item.num}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-sm text-rose-950 mb-0.5">
                            {item.title}
                          </h4>
                          <p className="text-xs text-rose-900/80 font-medium leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SECTION 2: Cracker-Wise Specific Tips (Visible on 'all' or 'types') */}
        {(activeTab === 'all' || activeTab === 'types') && (
          <div className="mb-14">
            <div className="text-center mb-8">
              <span className="text-[#2563EB] font-black text-xs uppercase tracking-widest block mb-1">
                Category Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                Cracker-Specific Safety Instructions
              </h2>
              <div className="w-12 h-1 bg-[#2563EB] mx-auto mt-2 rounded-full" />
              <p className="text-gray-500 text-xs sm:text-sm font-semibold max-w-lg mx-auto mt-2">
                Different firecracker types require distinct handling methods. Follow these item-specific techniques:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Type 1: Sparklers */}
              <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 w-max">
                  Kids Favorite
                </div>
                <h3 className="font-extrabold text-base text-gray-900 mb-2">
                  Sparklers (Kambi Mathapu)
                </h3>
                <ul className="text-xs text-gray-600 space-y-1.5 font-medium leading-relaxed flex-1">
                  <li>• Hold at arm's length away from body and face.</li>
                  <li>• Light one sparkler at a time only.</li>
                  <li>• Immediately drop hot burnt iron rods into a bucket of water.</li>
                  <li>• Never hand sparklers to children under 5 years old.</li>
                </ul>
              </div>

              {/* Type 2: Flower Pots */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 w-max">
                  Fountains & Anars
                </div>
                <h3 className="font-extrabold text-base text-gray-900 mb-2">
                  Flower Pots (Poochatti)
                </h3>
                <ul className="text-xs text-gray-600 space-y-1.5 font-medium leading-relaxed flex-1">
                  <li>• Place firmly upright on hard, flat, level ground.</li>
                  <li>• Light from the side using a long agarbatti stick.</li>
                  <li>• <strong className="text-red-600 font-black">NEVER bend over</strong> the mouth while lighting.</li>
                  <li>• Step back at least 5 meters immediately.</li>
                </ul>
              </div>

              {/* Type 3: Ground Chakkars */}
              <div className="bg-white rounded-2xl p-5 border border-blue-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mb-3 group-hover:scale-105 transition-transform">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div className="inline-block bg-blue-100 text-[#2563EB] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 w-max">
                  Spinning Fireworks
                </div>
                <h3 className="font-extrabold text-base text-gray-900 mb-2">
                  Ground Chakkars (Thara Chakkaram)
                </h3>
                <ul className="text-xs text-gray-600 space-y-1.5 font-medium leading-relaxed flex-1">
                  <li>• Place on completely flat, smooth concrete surface.</li>
                  <li>• Light the tip of the winding paper only.</li>
                  <li>• Ensure no loose clothing or footwear nearby.</li>
                  <li>• Never attempt to step on or stop a spinning chakkar.</li>
                </ul>
              </div>

              {/* Type 4: Aerial Shots & Rockets */}
              <div className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-105 transition-transform">
                  <Eye className="w-6 h-6" />
                </div>
                <div className="inline-block bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 w-max">
                  Sky Displays
                </div>
                <h3 className="font-extrabold text-base text-gray-900 mb-2">
                  Aerial Shots & Rockets
                </h3>
                <ul className="text-xs text-gray-600 space-y-1.5 font-medium leading-relaxed flex-1">
                  <li>• Secure base with bricks or sand to prevent tipping.</li>
                  <li>• Launch rockets from sturdy, straight launch pipes.</li>
                  <li>• Ensure completely open overhead sky without wires.</li>
                  <li>• Keep 25+ meters viewing distance for spectators.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3: First Aid Protocol (Visible on 'all' or 'firstaid') */}
        {(activeTab === 'all' || activeTab === 'firstaid') && (
          <div className="mb-14">
            <div className="bg-gradient-to-br from-blue-900 via-[#1E40AF] to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl mb-8">
                <span className="text-[#FFD400] text-xs font-black uppercase tracking-widest block mb-1">
                  Emergency Medical Guide
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display uppercase tracking-tight">
                  Immediate First Aid for Burns
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm font-medium mt-2 leading-relaxed">
                  In case of an accidental burn or spark injury, swift and correct response within the first 60 seconds drastically reduces skin damage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                
                {/* Step 1 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-sm mb-3 shadow-sm">
                    01
                  </div>
                  <h3 className="font-extrabold text-base text-white mb-2">
                    Cool with Running Water
                  </h3>
                  <p className="text-xs text-blue-100 font-medium leading-relaxed">
                    Immediately pour clean, cool tap water over the burn for <strong>15 to 20 continuous minutes</strong>. This immediately cools deep tissue and relieves stinging.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm mb-3 shadow-sm">
                    02
                  </div>
                  <h3 className="font-extrabold text-base text-white mb-2">
                    Debunk Common Myths
                  </h3>
                  <p className="text-xs text-blue-100 font-medium leading-relaxed">
                    <strong className="text-red-300">NEVER apply</strong> toothpaste, ice cubes, ink, turmeric, butter, or raw oils. These trap heat and cause severe bacterial infections.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-sm mb-3 shadow-sm">
                    03
                  </div>
                  <h3 className="font-extrabold text-base text-white mb-2">
                    Cover & Seek Medical Care
                  </h3>
                  <p className="text-xs text-blue-100 font-medium leading-relaxed">
                    Apply mild silver sulfadiazine burn ointment (Silverex) and cover lightly with clean sterile gauze. Do not burst blisters. Visit a physician or call <strong>108</strong>.
                  </p>
                </div>

              </div>

              {/* Eye Injury Note */}
              <div className="bg-red-500/20 border border-red-400/40 rounded-2xl p-4 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="text-red-200 block text-sm font-black mb-0.5">Special Protocol: Eye Injury from Flying Spark</strong>
                  <span className="text-blue-100">
                    Do NOT rub the eye under any circumstance. Gently flush with clean potable water or saline solution. Cover eye with a clean paper cup without pressing and rush immediately to an eye specialist hospital.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 4: Pet & Senior Safety Note */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 mb-12 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
            <Smile className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-black text-gray-900 mb-1">
              Be Compassionate: Care for Pets, Seniors & Infants
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Animals and birds possess hearing several times more sensitive than humans. Keep high-decibel crackers away from residential windows after 10 PM. Comfort pets indoors in quiet rooms and check on elderly family members.
            </p>
          </div>
          <Link
            to="/catalog?category=Kids"
            className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-105 shrink-0"
          >
            <span>Explore Kid-Safe Items</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <UserFooter />
    </div>
  );
};

export default SafetyTips;
