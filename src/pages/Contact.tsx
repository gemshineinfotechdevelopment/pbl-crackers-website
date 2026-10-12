import { useSiteSettings } from "@/context/SiteSettingsContext";
import UserHeader from "@/components/layout/UserHeader";
import UserFooter from "@/components/layout/UserFooter";
import { MapPin, MessageSquare, Phone, Navigation } from "lucide-react";
import contactImg from "@/assets/contact.png";

const Contact = () => {
  const { settings } = useSiteSettings();

  const phoneNum = settings.contact?.phone || "+91 94880 73004";
  const phoneNum2 = settings.contact?.phone2 || "";
  const cleanPhone = phoneNum.replace(/[^0-9]/g, "");
  const cleanPhone2 = phoneNum2 ? phoneNum2.replace(/[^0-9]/g, "") : "";

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF2] font-sans text-[#1F2937] antialiased">
      <UserHeader />

      {/* ──────────────── Premium Hero Banner ──────────────── */}
      <section className="relative w-full py-20 md:py-28 px-4 overflow-hidden bg-black flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url(${contactImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/90" />
        
        <div className="relative max-w-4xl mx-auto text-center z-10 space-y-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#FFD400] bg-black/40 text-[#FFD400] text-[10px] font-black tracking-widest uppercase mb-1 shadow-sm">
            ⚡ REACH OUR SIVAKASI HEADQUARTERS ⚡
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md uppercase">
            Visit &amp; Contact Us
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed opacity-95">
            Located directly in the heart of Sivakasi, Tamil Nadu. Find our location on the map below or contact our experts directly.
          </p>
        </div>
      </section>

      {/* ──────────────── Map + Headquarters Info ──────────────── */}
      <section className="w-full py-12 md:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* ─── Left: Embedded Google Map ─── */}
            <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-black text-gray-900 uppercase tracking-wide">
                      Interactive Location Map
                    </h2>
                    <p className="text-[11px] text-gray-500 font-semibold uppercase">
                      Sivakasi, Tamil Nadu - 626123
                    </p>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/2rSEUcrmFBpJ2qcA7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm transition-all hover:scale-105"
                >
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Responsive Map iFrame */}
              <div className="w-full flex-1 min-h-[380px] md:min-h-[460px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative bg-gray-100">
                <iframe
                  title="PBL Crackers Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.7130149435898!2d77.81535597375743!3d9.439364682433059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cffcd663a897%3A0xe2760844220366de!2sSai%20Yogi%20crackers!5e1!3m2!1sen!2sin!4v1786702640495!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full absolute inset-0"
                />
              </div>
            </div>

            {/* ─── Right: Global Headquarters & Support Cards ─── */}
            <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-display text-2xl font-black text-[#2563EB] mb-2 uppercase tracking-wide">
                  Global Headquarters
                </h3>
                <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                  Our master pyrotechnicians operate directly from the heart of the Sivakasi fireworks industry, ensuring maximum safety, quality control, and factory-direct pricing.
                </p>
              </div>

              {/* Physical Office Card */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
                <div className="w-11 h-11 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0 shadow-md text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#2563EB] font-black mb-1">
                    Physical Office &amp; Factory
                  </p>
                  <p className="text-xs font-black text-gray-900 uppercase">
                    PBL Crackers
                  </p>
                  <p className="text-xs text-gray-600 font-semibold mt-0.5 leading-relaxed">
                    3/1255/1B, Sri Ram Nagar, Paraipatti, Viswanatham, Sivakasi 626189
                  </p>
                </div>
              </div>

              {/* Call Support Card */}
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-4 bg-white border border-blue-200 rounded-2xl px-5 py-4 hover:bg-blue-50/60 hover:border-blue-300 transition-all shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#2563EB] uppercase tracking-wider group-hover:text-[#1D4ED8] transition-colors">
                      {phoneNum2 ? "Phone Call (Primary)" : "Direct Phone Call"}
                    </p>
                    <p className="text-xs font-black text-gray-900 mt-0.5">
                      {phoneNum}
                    </p>
                  </div>
                </a>

                {phoneNum2 && (
                  <a
                    href={`tel:${cleanPhone2}`}
                    className="flex items-center gap-4 bg-white border border-blue-200 rounded-2xl px-5 py-4 hover:bg-blue-50/60 hover:border-blue-300 transition-all shadow-md group cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#2563EB] uppercase tracking-wider group-hover:text-[#1D4ED8] transition-colors">
                        Phone Call (Alternate)
                      </p>
                      <p className="text-xs font-black text-gray-900 mt-0.5">
                        {phoneNum2}
                      </p>
                    </div>
                  </a>
                )}
              </div>

              {/* WhatsApp Support Box */}
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white border border-green-200/80 rounded-2xl px-5 py-4 hover:bg-green-50/60 hover:border-green-300 transition-all shadow-md group cursor-pointer"
              >
                <div className="w-11 h-11 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#25D366] uppercase tracking-wider group-hover:text-green-700 transition-colors">
                    WhatsApp Sales Support
                  </p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                    Instant response for bulk inquiries &amp; estimates
                  </p>
                </div>
              </a>
            </div>

          </div>
        </div>
      </section>
      <UserFooter />
    </div>
  );
};

export default Contact;
