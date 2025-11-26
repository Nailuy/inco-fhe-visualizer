import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LockIcon from './components/LockIcon';
import KeyIcon from './components/KeyIcon';

// Import developer avatars
import nailuyImg from './assets/nailuy.png';
import keshaImg from './assets/kesha.jpg';
import svyateoImg from './assets/svyateo.png';
import thekas1kImg from './assets/thekas1k.jpg';

// Import Main Logo
import logoImg from './assets/logo.png';

// Developer data
const developers = [
    { name: 'nailuy', img: nailuyImg },
    { name: 'Crypto_Kesha', img: keshaImg },
    { name: 'svyateo', img: svyateoImg },
    { name: 'thekas1k', img: thekas1kImg },
];


// Possible app stages
const STAGES = {
    IDLE: 'IDLE',         // Start: waiting for input
    ENCRYPTED: 'ENCRYPTED', // Data is in the cube, ready for computation
    DECRYPTED: 'DECRYPTED', // Finish: result shown
};

// Animation variants for the cube shake effect
const cubeVariants = {
    idle: { x: 0, rotate: 0, scale: 1 },
    shake: {
        x: [0, -3, 3, -3, 3, 0],
        rotate: [0, -1, 1, -1, 1, 0],
        scale: [1, 1.02, 1, 1.02, 1],
        transition: { duration: 0.4, ease: "easeInOut" }
    }
};

function App() {
    // --- STATE ---
    const [inputValue, setInputValue] = useState('');
    const [secretValue, setSecretValue] = useState(null);
    const [appStage, setAppStage] = useState(STAGES.IDLE);
    const [isAnimating, setIsAnimating] = useState(false);

    // --- HANDLERS ---

    // 1. Encrypt
    const handleEncrypt = () => {
        const num = parseFloat(inputValue);
        if (isNaN(num)) return;

        setSecretValue(num);
        setAppStage(STAGES.ENCRYPTED);
        setInputValue('');
    };

    // 2. Compute
    const handleOperation = (type, amount) => {
        if (appStage !== STAGES.ENCRYPTED || isAnimating) return;

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);

        setSecretValue((prevValue) => {
            switch (type) {
                case 'ADD': return prevValue + amount;
                case 'SUBTRACT': return prevValue - amount;
                case 'MULTIPLY': return prevValue * amount;
                case 'DIVIDE': return prevValue / amount;
                default: return prevValue;
            }
        });
    };

    // 3. Decrypt
    const handleDecrypt = () => {
        if (appStage !== STAGES.ENCRYPTED) return;
        setAppStage(STAGES.DECRYPTED);
    };

    // Reset
    const handleReset = () => {
        setInputValue('');
        setSecretValue(null);
        setAppStage(STAGES.IDLE);
    };


    return (
        <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden font-sans selection:bg-blue-500/30 relative">

            {/* CENTERED HUGE LOGO */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 z-20"
            >
                <img src={logoImg} alt="Inco Logo" className="w-48 h-48 sm:w-64 sm:h-64 mx-auto object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-center mb-8 sm:mb-12 z-10"
            >
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl">
                    The FHE Visualizer
                </h1>
                <p className="text-blue-200/60 mt-3 text-lg font-medium">
                    See how <span className="text-blue-400">Inco Network</span> computes on encrypted data.
                </p>
            </motion.div>

            <div className="relative w-full max-w-5xl bg-gray-900/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_60px_-15px_rgba(59,130,246,0.15)] border border-blue-500/10 p-6 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-start z-10">

                {/* --- LEFT COLUMN: DATA INPUT --- */}
                <div className="flex flex-col gap-6 h-full">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm border border-blue-500/20">1</div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Input Data</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">Your secret number. We'll encrypt it so only you hold the key.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {appStage === STAGES.IDLE ? (
                            <motion.div
                                key="input-form"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, y: -30, filter: 'blur(5px)', transition: { duration: 0.3 } }}
                                className="flex flex-col gap-4 flex-1 justify-center"
                            >
                                <div className="relative group">
                                    <input
                                        type="number"
                                        placeholder="Enter a number (e.g., 42)"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full bg-[#131b2c] border border-blue-500/20 rounded-2xl px-6 py-5 text-2xl font-bold focus:outline-none focus:border-blue-500/60 focus:bg-blue-500/5 transition-all text-center placeholder:text-gray-600"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: '#2563eb' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleEncrypt}
                                    disabled={!inputValue}
                                    className="w-full bg-blue-600 text-white font-bold rounded-2xl px-6 py-4 transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_-5px_rgba(37,99,235,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
                                >
                                    <LockIcon className="w-6 h-6" />
                                    Encrypt & Send to Inco
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="input-placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center p-6 bg-[#131b2c]/50 rounded-2xl border-2 border-dashed border-gray-700/50 gap-3"
                            >
                                <LockIcon className="w-8 h-8 text-gray-600" />
                                <p className="text-gray-500 text-center font-medium">Input Module Locked</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


                {/* --- CENTER COLUMN: FHE CUBE --- */}
                <div className="flex flex-col items-center justify-center py-4 sm:py-8 order-first md:order-none relative z-10 h-full">
                    {/* The Cube */}
                    <motion.div
                        variants={cubeVariants}
                        animate={isAnimating ? "shake" : "idle"}
                        className="relative w-56 h-56 sm:w-72 sm:h-72 bg-gradient-to-b from-[#1a2235] to-[#0d121f] rounded-[2.5rem] border border-blue-500/20 shadow-[0_10px_60px_-15px_rgba(59,130,246,0.25)] flex items-center justify-center overflow-hidden z-10 group"
                    >

                        <AnimatePresence mode="wait">
                            {appStage === STAGES.IDLE && (
                                <motion.div
                                    key="idle-state"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="text-gray-600 flex flex-col items-center gap-3 relative z-20"
                                >
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                                        <div className="w-4 h-4 bg-blue-500 rounded-full relative z-10 shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
                                    </div>
                                    <span className="text-sm font-bold tracking-widest text-blue-200/50 mt-4">WAITING FOR ENCRYPTED DATA...</span>
                                </motion.div>
                            )}

                            {appStage === STAGES.ENCRYPTED && (
                                <motion.div
                                    key="encrypted-state"
                                    initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0, transition: { type: 'spring', stiffness: 150, damping: 12 } }}
                                    exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                                    className="text-blue-500 flex flex-col items-center gap-4 relative z-20"
                                >
                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="relative">
                                        <LockIcon className="w-28 h-28 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] relative z-10" />
                                        <div className="absolute inset-0 bg-blue-500/30 blur-2xl -z-10 rounded-full"></div>
                                    </motion.div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-black tracking-[0.3em] animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">ENCRYPTED</span>
                                        <span className="text-xs text-blue-300/60 tracking-wider font-medium mt-1">FHE STATE ACTIVE</span>
                                    </div>
                                </motion.div>
                            )}

                            {appStage === STAGES.DECRYPTED && (
                                <motion.div
                                    key="decrypted-state"
                                    initial={{ opacity: 0, scale: 0.7, filter: 'blur(15px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'backOut' } }}
                                    className="text-green-400 flex flex-col items-center gap-1 relative z-20"
                                >
                                    <div className="relative">
                    <span className="text-7xl font-black tracking-tighter drop-shadow-[0_0_30px_rgba(74,222,128,0.6)] bg-gradient-to-b from-green-300 to-green-500 bg-clip-text text-transparent relative z-10">
                      {secretValue}
                    </span>
                                        <div className="absolute inset-0 bg-green-500/20 blur-3xl -z-10 rounded-full scale-150"></div>
                                    </div>
                                    <span className="text-sm font-bold tracking-wider text-green-400/80 mt-2">FINAL RESULT</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Visual effects inside the cube */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none z-0"></div>
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>
                        <AnimatePresence>
                            {isAnimating && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-blue-400/25 z-0 mix-blend-screen"
                                ></motion.div>
                            )}
                        </AnimatePresence>
                        {/* Subtle border glow on hover */}
                        <div className="absolute inset-0 rounded-[2.5rem] border-2 border-blue-500/0 group-hover:border-blue-500/30 transition-colors duration-500 pointer-events-none z-30"></div>
                    </motion.div>

                    <div className="mt-8 h-12 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {appStage === STAGES.IDLE && <motion.p key="t1" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="text-gray-500 text-sm font-medium">Start by entering a number on the left.</motion.p>}
                            {appStage === STAGES.ENCRYPTED && <motion.p key="t2" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="text-blue-300/80 text-sm font-medium text-center px-4"><span className="font-bold text-blue-400">The magic happens here.</span> The lock never opens, even during computation.</motion.p>}
                            {appStage === STAGES.DECRYPTED && <motion.p key="t3" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="text-green-400/80 text-sm font-medium">Computation complete. Decrypted using your private key.</motion.p>}
                        </AnimatePresence>
                    </div>
                </div>


                {/* --- RIGHT COLUMN: OPERATIONS & RESULT --- */}
                <div className="flex flex-col gap-6 h-full justify-between">

                    {/* Operations Deck */}
                    <motion.div
                        animate={{ opacity: appStage === STAGES.ENCRYPTED ? 1 : 0.3, filter: appStage === STAGES.ENCRYPTED ? 'blur(0px)' : 'grayscale(100%) blur(1px)' }}
                        className={`transition-all duration-500 ${appStage !== STAGES.ENCRYPTED ? 'pointer-events-none select-none' : ''}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm border transition-colors duration-500 ${appStage === STAGES.ENCRYPTED ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-700/20 text-gray-500 border-gray-700/30'}`}>2</div>
                            <h2 className={`text-xl font-bold tracking-tight transition-colors duration-500 ${appStage === STAGES.ENCRYPTED ? 'text-white' : 'text-gray-500'}`}>Compute on FHE</h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">Perform math operations on the <span className="font-semibold text-blue-300/80">locked</span> data. The value changes, but remains hidden.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'].map((type, index) => {
                                const labels = { ADD: '+ 5', SUBTRACT: '- 3', MULTIPLY: '× 2', DIVIDE: '/ 2' };
                                const values = { ADD: 5, SUBTRACT: 3, MULTIPLY: 2, DIVIDE: 2 };
                                return (
                                    <motion.button
                                        key={type}
                                        whileHover={{ scale: 1.03, backgroundColor: '#2c354b', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.2)' }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleOperation(type, values[type])}
                                        className="bg-[#1a2235] text-gray-200 font-bold text-xl rounded-2xl px-4 py-5 transition-all border border-gray-700/30 hover:border-blue-500/30 hover:text-blue-300"
                                    >
                                        {labels[type]}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Decryption Zone */}
                    <div className="mt-auto pt-8 border-t border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm border transition-colors duration-500 ${appStage === STAGES.ENCRYPTED ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700/20 text-gray-500 border-gray-700/30'}`}>3</div>
                            <h2 className={`text-xl font-bold tracking-tight transition-colors duration-500 ${appStage === STAGES.DECRYPTED ? 'text-white' : appStage === STAGES.ENCRYPTED ? 'text-white' : 'text-gray-500'}`}>Reveal Result</h2>
                        </div>

                        <AnimatePresence mode="wait">
                            {appStage !== STAGES.DECRYPTED ? (
                                <motion.button
                                    key="decrypt-btn"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    whileHover={{ scale: 1.02, backgroundColor: '#16a34a' }}
                                    whileTap={{ scale: 1.05 }}
                                    onClick={handleDecrypt}
                                    disabled={appStage !== STAGES.ENCRYPTED}
                                    className="w-full bg-green-600 text-white font-bold rounded-2xl px-6 py-4 transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_-5px_rgba(22,163,74,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:hover:bg-green-600"
                                >
                                    <KeyIcon className="w-6 h-6" />
                                    Decrypt with Private Key
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="reset-btn"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02, backgroundColor: '#374151' }}
                                    whileTap={{ scale: 1.05 }}
                                    onClick={handleReset}
                                    className="w-full bg-gray-700 text-white font-bold rounded-2xl px-6 py-4 transition-all flex items-center justify-center gap-3 shadow-lg border border-gray-600/30"
                                >
                                    Start Over & Try Again
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>

            {/* DEVELOPERS SECTION (FIXED TOOLTIPS) */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3 bg-gray-900/60 backdrop-blur-xl rounded-full border border-blue-500/10 shadow-2xl hover:border-blue-500/30 transition-colors group/container">
                <span className="text-gray-400 text-xs font-medium pl-2 uppercase tracking-wider opacity-70 group-hover/container:opacity-100 transition-opacity">Built by:</span>
                <div className="flex -space-x-3">
                    {developers.map((dev, index) => (
                        <div key={index} className="relative group/avatar">
                            <motion.img
                                whileHover={{ scale: 1.15, zIndex: 10 }}
                                src={dev.img}
                                alt={dev.name}
                                className="w-10 h-10 rounded-full border-2 border-gray-900 relative z-0 transition-all shadow-md cursor-pointer"
                                style={{boxShadow: '0 0 0 2px rgba(59,130,246,0.1)'}}
                            />
                            {/* Tooltip - fixed showing logic */}
                            <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 translate-y-1 group-hover/avatar:opacity-100 group-hover/avatar:translate-y-0 transition-all duration-200 pointer-events-none shadow-lg before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-blue-600"
                            >
                                {dev.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Footer / Background elements */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.15)_0%,_rgba(10,14,23,0)_70%)] -z-10 pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(37,99,235,0.1)_0%,_rgba(10,14,23,0)_60%)] -z-10 pointer-events-none"></div>
        </div>
    );
}

export default App;