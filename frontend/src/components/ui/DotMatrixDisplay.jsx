import React, { useState, useEffect, useRef, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Camera, CameraOff, Aperture, Circle } from 'lucide-react';

/* ── 5×3 digit patterns ── */
const DIGITS = {
    '0': [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
    '1': [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1],
    '2': [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
    '3': [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    '4': [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
    '5': [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    '6': [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    '7': [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    '8': [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    // degree symbol (3×3)
    '°': [0, 1, 0, 1, 0, 1, 0, 1, 0],
    // C character (3×5)
    'C': [1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1],
    // Letters for themes (3x5)
    'A': [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,0,1],
    'B': [1,1,0, 1,0,1, 1,1,0, 1,0,1, 1,1,0],
    'E': [1,1,1, 1,0,0, 1,1,0, 1,0,0, 1,1,1],
    'G': [0,1,1, 1,0,0, 1,0,1, 1,0,1, 0,1,1],
    'L': [1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,1,1],
    'M': [1,1,1, 1,1,1, 1,0,1, 1,0,1, 1,0,1],
    'N': [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,0,1],
    'O': [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1],
    'R': [1,1,0, 1,0,1, 1,1,0, 1,0,1, 1,0,1],
    'S': [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
    'T': [1,1,1, 0,1,0, 0,1,0, 0,1,0, 0,1,0],
    'U': [1,0,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1],
    'Y': [1,0,1, 1,0,1, 0,1,0, 0,1,0, 0,1,0],
};

const GRID_SIZE = 27;
const DOT_SIZE = 5;
const DOT_GAP = 2;
const DISPLAY_PX = GRID_SIZE * (DOT_SIZE + DOT_GAP) - DOT_GAP;

/** Precompute circle mask */
const buildCircleMask = () => {
    const mask = new Array(GRID_SIZE * GRID_SIZE);
    const center = (GRID_SIZE - 1) / 2;
    const radius = GRID_SIZE / 2 - 0.5;
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const dx = x - center;
            const dy = y - center;
            mask[y * GRID_SIZE + x] = (dx * dx + dy * dy) <= (radius * radius);
        }
    }
    return mask;
};
const CIRCLE_MASK = buildCircleMask();

/** Stamp a digit at 1x scale */
const stampDigit = (grid, char, startCol, startRow) => {
    const pattern = DIGITS[char];
    if (!pattern) return;
    const cols = 3;
    const rows = (char === '°') ? 3 : 5;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const gx = startCol + c;
            const gy = startRow + r;
            if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
                grid[gy * GRID_SIZE + gx] = pattern[r * cols + c];
            }
        }
    }
};

/** Stamp a digit at 2x scale (each pixel becomes a 2×2 block) */
const stampDigit2x = (grid, char, startCol, startRow) => {
    const pattern = DIGITS[char];
    if (!pattern) return;
    const cols = 3;
    const rows = (char === '°') ? 3 : 5;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const val = pattern[r * cols + c];
            for (let dy = 0; dy < 2; dy++) {
                for (let dx = 0; dx < 2; dx++) {
                    const gx = startCol + c * 2 + dx;
                    const gy = startRow + r * 2 + dy;
                    if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
                        grid[gy * GRID_SIZE + gx] = val;
                    }
                }
            }
        }
    }
};

/** Stamp colon */
const stampColon = (grid, col, startRow, blink) => {
    if (!blink) return;
    const dot1 = (startRow + 1) * GRID_SIZE + col;
    const dot2 = (startRow + 3) * GRID_SIZE + col;
    if (dot1 < grid.length) grid[dot1] = 1;
    if (dot2 < grid.length) grid[dot2] = 1;
};

/** Build clock grid: HH:MM centered, SS below */
const buildClockGrid = (time) => {
    const grid = new Array(GRID_SIZE * GRID_SIZE).fill(0);
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    const blink = s % 2 === 0;

    const totalW = 15;
    const offsetX = Math.floor((GRID_SIZE - totalW) / 2);
    const offsetY = Math.floor((GRID_SIZE - 5) / 2) - 2;

    stampDigit(grid, h[0], offsetX, offsetY);
    stampDigit(grid, h[1], offsetX + 4, offsetY);
    stampColon(grid, offsetX + 7, offsetY, blink);
    stampDigit(grid, m[0], offsetX + 9, offsetY);
    stampDigit(grid, m[1], offsetX + 13, offsetY);

    const secW = 7;
    const secX = Math.floor((GRID_SIZE - secW) / 2);
    const secY = offsetY + 7;
    stampDigit(grid, s[0], secX, secY);
    stampDigit(grid, s[1], secX + 4, secY);
    return grid;
};

/** Build temperature grid: "XX°C" centered at 2x scale */
const buildTempGrid = (degC) => {
    const grid = new Array(GRID_SIZE * GRID_SIZE).fill(0);
    const tempStr = degC.toString();
    const isDoubleDigit = tempStr.length >= 2;

    // At 2x: each digit is 6 wide, each gap is 1
    // Layout: [D1?](6+1) [D2](6+1) [°](6+1) [C](6)
    // Double: 7+7+7+6 = 27, Single: 7+7+6 = 20
    const totalW = isDoubleDigit ? 25 : 19;
    const offsetX = Math.floor((GRID_SIZE - totalW) / 2);
    const offsetY = Math.floor((GRID_SIZE - 10) / 2);

    let x = offsetX;
    if (isDoubleDigit) {
        stampDigit2x(grid, tempStr[0], x, offsetY);
        x += 7;
        stampDigit2x(grid, tempStr[1], x, offsetY);
        x += 7;
    } else {
        stampDigit2x(grid, tempStr[0], x, offsetY);
        x += 7;
    }
    // degree symbol at 1x scale (small), top-aligned
    stampDigit(grid, '°', x, offsetY);
    x += 4;
    // C at 2x
    stampDigit2x(grid, 'C', x, offsetY);

    return grid;
};

/** Build text grid: up to 6 characters centered at 1x scale */
const buildTextGrid = (str) => {
    const grid = new Array(GRID_SIZE * GRID_SIZE).fill(0);
    const text = str.substring(0, 6).toUpperCase();
    const totalW = text.length * 4 - 1; // 3 width + 1 gap per char
    const offsetX = Math.floor((GRID_SIZE - totalW) / 2);
    const offsetY = Math.floor((GRID_SIZE - 5) / 2);

    let x = offsetX;
    for (let i = 0; i < text.length; i++) {
        stampDigit(grid, text[i], x, offsetY);
        x += 4;
    }
    return grid;
};


/**
 * Circular Dot Matrix Display.
 * Props:
 *   tempDisplayValue: number | null — when set, shows temperature instead of clock
 *   cameraMode: boolean (optional, controlled)
 *   setCameraMode: function (optional, controlled)
 *   showBuiltinControls: boolean (default true)
 */
const DotMatrixDisplay = forwardRef(({ 
    tempDisplayValue = null,
    cameraMode: externalCameraMode = null,
    setCameraMode: setExternalCameraMode = null,
    showBuiltinControls = true
}, ref) => {
    const [internalCameraMode, setInternalCameraMode] = useState(false);
    const cameraMode = externalCameraMode !== null ? externalCameraMode : internalCameraMode;
    const setCameraMode = setExternalCameraMode !== null ? setExternalCameraMode : setInternalCameraMode;

    const [cameraGrid, setCameraGrid] = useState(null);
    const [time, setTime] = useState(new Date());
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);

    // Clock tick
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Turn off camera when user leaves window (tab switch or window blur)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) setCameraMode(false);
        };
        const handleWindowBlur = () => setCameraMode(false);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [setCameraMode]);

    // Camera logic
    const stopCamera = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    const sampleFrame = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamRef.current) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = GRID_SIZE;
        canvas.height = GRID_SIZE;

        const draw = () => {
            if (!streamRef.current) return;
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -GRID_SIZE, 0, GRID_SIZE, GRID_SIZE);
            ctx.restore();

            const imageData = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);
            const pixels = imageData.data;
            const grid = new Array(GRID_SIZE * GRID_SIZE);

            for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
                const idx = i * 4;
                const brightness = (pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114) / 255;
                grid[i] = brightness;
            }

            setCameraGrid(grid);
            animFrameRef.current = requestAnimationFrame(draw);
        };

        if (video.readyState >= 2) {
            draw();
        } else {
            video.addEventListener('loadeddata', draw, { once: true });
        }
    }, [setCameraGrid]);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: GRID_SIZE * 4, height: GRID_SIZE * 4, facingMode: 'user' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                sampleFrame();
            }
        } catch (err) {
            console.warn('Camera access denied:', err);
            setCameraMode(false);
        }
    }, [sampleFrame, setCameraMode]);

    // Camera lifecycle
    useEffect(() => {
        if (cameraMode) {
            startCamera();
        } else {
            stopCamera();
            setCameraGrid(null);
        }
        return () => stopCamera();
    }, [cameraMode, startCamera, stopCamera]);

    // Capture current dot matrix as image and download
    const captureAndDownload = useCallback(() => {
        if (!cameraGrid) return;
        const scale = 4; // each dot becomes 4×4 px
        const totalPx = GRID_SIZE * (DOT_SIZE * scale + DOT_GAP) - DOT_GAP;
        const offscreen = document.createElement('canvas');
        offscreen.width = totalPx;
        offscreen.height = totalPx;
        const ctx = offscreen.getContext('2d');

        // Black background
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, totalPx, totalPx);

        // Clip to circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(totalPx / 2, totalPx / 2, totalPx / 2, 0, Math.PI * 2);
        ctx.clip();

        // Draw dots
        const grid = cameraGrid;
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            if (!CIRCLE_MASK[i]) continue;
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const brightness = typeof grid[i] === 'number' ? grid[i] : 0;
            const px = x * (DOT_SIZE * scale + DOT_GAP);
            const py = y * (DOT_SIZE * scale + DOT_GAP);

            if (brightness > 0.15) {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(brightness * 1.2, 1)})`;
            } else {
                ctx.fillStyle = '#1A1A1A';
            }
            ctx.fillRect(px, py, DOT_SIZE * scale, DOT_SIZE * scale);
        }
        ctx.restore();

        // Download
        const link = document.createElement('a');
        link.download = 'dotmatrix-selfie.png';
        link.href = offscreen.toDataURL('image/png');
        link.click();
    }, [cameraGrid]);

    // Expose capture and toggle to parent
    useImperativeHandle(ref, () => ({
        captureAndDownload,
        cameraMode
    }), [captureAndDownload, cameraMode]);

    // Determine which grid to display
    const displayGrid = useMemo(() => {
        if (cameraMode && cameraGrid) return cameraGrid;
        if (tempDisplayValue !== null && !cameraMode) {
            if (typeof tempDisplayValue === 'string') return buildTextGrid(tempDisplayValue);
            return buildTempGrid(tempDisplayValue);
        }
        return buildClockGrid(time);
    }, [cameraMode, cameraGrid, tempDisplayValue, time]);


    // Labels
    const modeLabel = cameraMode ? 'CAM' : (
        tempDisplayValue !== null 
            ? (typeof tempDisplayValue === 'string' ? 'SYS' : '°C') 
            : 'IST'
    );
    const topLabel = cameraMode ? 'LIVE' : (
        tempDisplayValue !== null 
            ? (typeof tempDisplayValue === 'string' ? 'THEME' : 'TEMP') 
            : 'TIME'
    );

    return (
        <div className="relative" style={{ width: DISPLAY_PX + 20, height: DISPLAY_PX + 20 }}>
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />

            {/* Green active indicator — top right of container */}
            {cameraMode && (
                <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full z-10"
                    style={{
                        backgroundColor: '#22C55E',
                        boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
                    }}
                />
            )}

            {/* Circular display */}
            <div
                style={{
                    width: DISPLAY_PX + 20,
                    height: DISPLAY_PX + 20,
                    borderRadius: '50%',
                    backgroundColor: '#0A0A0A',
                    padding: 10,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, ${DOT_SIZE}px)`,
                        gap: `${DOT_GAP}px`,
                    }}
                >
                    {displayGrid.map((val, i) => {
                        const inCircle = CIRCLE_MASK[i];
                        if (!inCircle) {
                            return <div key={i} style={{ width: DOT_SIZE, height: DOT_SIZE }} />;
                        }
                        const brightness = typeof val === 'number' ? val : 0;
                        const isOn = brightness > 0.15;
                        return (
                            <div
                                key={i}
                                className="rounded-[1px]"
                                style={{
                                    width: DOT_SIZE,
                                    height: DOT_SIZE,
                                    backgroundColor: isOn
                                        ? `var(--dot-color, rgba(255, 255, 255, ${Math.min(brightness * 1.2, 1)}))`
                                        : '#1A1A1A',
                                    boxShadow: (brightness > 0.5)
                                        ? `0 0 ${Math.round(brightness * 4)}px var(--dot-glow, rgba(255, 255, 255, ${brightness * 0.3}))`
                                        : 'none',
                                    transition: cameraMode ? 'none' : 'background-color 0.3s, box-shadow 0.3s',
                                }}
                            />
                        );
                    })}
                </div>

                {/* Mode label */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <span className="font-mono text-[7px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {modeLabel}
                    </span>
                </div>
            </div>

            {/* Capture button — bottom left, only when camera is active */}
            {showBuiltinControls && cameraMode && cameraGrid && (
                <button
                    onClick={captureAndDownload}
                    className="absolute bottom-0 left-0 w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-full bg-background"
                    style={{
                        zIndex: 2,
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.25), -2px -2px 5px rgba(255,255,255,0.03)',
                    }}
                    title="Capture dot matrix selfie"
                >
                    <Aperture size={15} className="text-textMuted" />
                </button>
            )}

            {/* Camera toggle — bottom right, neumorphic with lighter shadows */}
            {showBuiltinControls && (
                <button
                    onClick={() => setCameraMode(prev => !prev)}
                    className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-full bg-background"
                    style={{
                        zIndex: 2,
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.25), -2px -2px 5px rgba(255,255,255,0.03)',
                    }}
                    title={cameraMode ? 'Switch to clock' : 'Switch to camera'}
                >
                    {cameraMode
                        ? <CameraOff size={13} className="text-green-400" />
                        : <Camera size={13} className="text-textMuted" />
                    }
                </button>
            )}
        </div>
    );
});

export default DotMatrixDisplay;
