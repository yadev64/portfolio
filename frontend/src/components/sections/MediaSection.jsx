import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MOCK_MEDIA = [
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1470&auto=format&fit=crop", caption: "Interceptor 650", aspect: "video" },
    { id: 2, type: "image", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop", caption: "System architecture design session", aspect: "square" },
    { id: 3, type: "image", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop", caption: "Late night coding", aspect: "portrait" },
    { id: 4, type: "video", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop", caption: "Demo Recording", aspect: "video" }
]

export const MediaSection = () => {
    const [selectedMedia, setSelectedMedia] = useState(null)

    return (
        <section id="media" className="min-h-full py-12 px-4 md:px-12 relative">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-display font-bold text-text-primary mb-16 text-center">
                    Memory <span className="text-accent-primary italic">Dump</span>
                </h2>

                {/* CSS Grid for masonry approximation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] grid-flow-dense">
                    {MOCK_MEDIA.map((item, idx) => {
                        const aspectClasses = {
                            "video": "col-span-1 md:col-span-2 row-span-1 border-border border rounded-2xl overflow-hidden",
                            "square": "col-span-1 row-span-1 border-border border rounded-2xl overflow-hidden",
                            "portrait": "col-span-1 row-span-2 border-border border rounded-2xl overflow-hidden"
                        }

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                onClick={() => setSelectedMedia(item)}
                                className={`group relative cursor-pointer ${aspectClasses[item.aspect]}`}
                            >
                                <img
                                    src={item.url}
                                    alt={item.caption}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />

                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-16 h-16 rounded-full bg-accent-primary/20 backdrop-blur border border-accent-primary flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-accent-primary ml-1" />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="font-mono text-sm text-white">{item.caption}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMedia(null)}
                        className="fixed inset-0 z-[999] bg-bg-primary/95 backdrop-blur flex flex-col items-center justify-center p-4"
                    >
                        <button
                            className="absolute top-8 right-8 text-white hover:text-accent-primary font-mono text-sm"
                            onClick={() => setSelectedMedia(null)}
                        >
                            [ CLOSE ]
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            src={selectedMedia.url}
                            className="max-w-full max-h-[85vh] rounded-xl border border-border shadow-2xl"
                        />
                        <p className="mt-8 font-mono text-text-secondary">{selectedMedia.caption}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
