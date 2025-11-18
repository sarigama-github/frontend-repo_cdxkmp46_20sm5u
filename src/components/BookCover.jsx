import { motion } from 'framer-motion'

export default function BookCover({ onOpen, dark }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      <motion.div
        className={`relative mx-auto w-[880px] max-w-full aspect-[16/10] rounded-2xl shadow-2xl overflow-hidden ${dark ? 'bg-[#1a140e]' : 'bg-[#3b2a1f]'}`}
        style={{
          backgroundImage: dark
            ? 'radial-gradient(800px 400px at 50% 30%, rgba(255,215,128,0.05), transparent), radial-gradient(600px 300px at 30% 80%, rgba(255,255,255,0.04), transparent)'
            : 'radial-gradient(800px 400px at 50% 30%, rgba(255,220,150,0.08), transparent), radial-gradient(600px 300px at 30% 80%, rgba(255,255,255,0.06), transparent)'
        }}
        initial={{ rotateX: 0, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      >
        {/* Leather grain hint */}
        <div className={`absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none ${dark ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05),transparent_30%)]' : 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_30%)]'}`}></div>

        {/* Gold edge */}
        <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-500 opacity-80"></div>

        {/* Title */}
        <div className="absolute inset-0 grid place-items-center p-10">
          <div className="text-center">
            <div className={`tracking-widest mb-3 ${dark ? 'text-amber-300' : 'text-yellow-200'}`}>THE TRADER'S JOURNAL</div>
            <div className={`text-4xl sm:text-5xl font-semibold mb-2 ${dark ? 'text-amber-200' : 'text-yellow-100'}`}>— By Ash ICT —</div>
            <div className={`${dark ? 'text-amber-400/80' : 'text-yellow-300/80'} text-sm`}>Tap the book to open</div>
          </div>
        </div>

        {/* Click overlay */}
        <button
          onClick={onOpen}
          className="absolute inset-0"
          aria-label="Open journal"
        />

        {/* Subtle desk shadow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-black/40 blur-2xl rounded-full"></div>
      </motion.div>
    </div>
  )
}
