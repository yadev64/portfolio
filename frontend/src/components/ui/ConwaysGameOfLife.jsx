import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

// Fixed square cell dimension in canvas pixels for perfectly 1:1 isometric cells
const CELL_SIZE = 11;
const DEFAULT_ROWS = 12;
const DEFAULT_COLS = 22;

// Classic Conway glider pattern (relative offsets)
const GLIDER = [
    [0, 1], [1, 2], [2, 0], [2, 1], [2, 2]
];

export const ConwaysGameOfLife = ({ className = '' }) => {
    const { theme, aesthetic } = useAppStore();
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    // Keep dynamic dimensions in ref so render loop and simulation are always synchronized
    const dimsRef = useRef({ rows: DEFAULT_ROWS, cols: DEFAULT_COLS, width: 220, height: 132 });
    const gridRef = useRef(createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS));
    const animFrameRef = useRef(null);
    const lastTickRef = useRef(0);
    const isDrawingRef = useRef(false);

    const [isRunning, setIsRunning] = useState(true);
    const [generation, setGeneration] = useState(0);
    const [population, setPopulation] = useState(0);

    function createEmptyGrid(r, c) {
        return Array.from({ length: r }, () => new Uint8Array(c));
    }

    function createRandomGrid(r, c) {
        const grid = createEmptyGrid(r, c);
        for (let row = 0; row < r; row++) {
            for (let col = 0; col < c; col++) {
                grid[row][col] = Math.random() > 0.72 ? 1 : 0;
            }
        }
        return grid;
    }

    // Initialize initial random grid
    useEffect(() => {
        gridRef.current = createRandomGrid(DEFAULT_ROWS, DEFAULT_COLS);
    }, []);

    // ResizeObserver: measures container width & height, dynamically adapts COLS & ROWS to keep cells perfectly square
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const updateDimensions = () => {
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            // Calculate integer columns and rows based on fixed square cell size
            // Clamp min cols to 10 so there's always a rich playground
            const newCols = Math.max(10, Math.floor(rect.width / CELL_SIZE));
            const newRows = Math.max(8, Math.floor(rect.height / CELL_SIZE));

            const prevCols = dimsRef.current.cols;
            const prevRows = dimsRef.current.rows;

            // Update canvas buffer size to match integer cell grid (sharp 1:1 pixel rendering, no stretching)
            const exactWidth = newCols * CELL_SIZE;
            const exactHeight = newRows * CELL_SIZE;

            canvas.width = exactWidth;
            canvas.height = exactHeight;

            dimsRef.current = {
                rows: newRows,
                cols: newCols,
                width: exactWidth,
                height: exactHeight
            };

            // If dimensions changed, preserve existing living cells in the overlapping area or seed new area
            if (newCols !== prevCols || newRows !== prevRows) {
                const oldGrid = gridRef.current;
                const newGrid = createEmptyGrid(newRows, newCols);
                let count = 0;

                for (let r = 0; r < newRows; r++) {
                    for (let c = 0; c < newCols; c++) {
                        if (oldGrid[r] && oldGrid[r][c] !== undefined) {
                            newGrid[r][c] = oldGrid[r][c];
                        } else {
                            newGrid[r][c] = Math.random() > 0.75 ? 1 : 0;
                        }
                        if (newGrid[r][c]) count++;
                    }
                }

                gridRef.current = newGrid;
                setPopulation(count);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });

        resizeObserver.observe(container);
        updateDimensions();

        return () => resizeObserver.disconnect();
    }, []);

    const resetGrid = useCallback(() => {
        const { rows, cols } = dimsRef.current;
        gridRef.current = createRandomGrid(rows, cols);
        setGeneration(0);
    }, []);

    const spawnGlider = useCallback(() => {
        const { rows, cols } = dimsRef.current;
        const grid = gridRef.current;
        const rOffset = Math.floor(Math.random() * Math.max(1, rows - 4));
        const cOffset = Math.floor(Math.random() * Math.max(1, cols - 4));
        GLIDER.forEach(([dr, dc]) => {
            if (grid[rOffset + dr] && grid[rOffset + dr][cOffset + dc] !== undefined) {
                grid[rOffset + dr][cOffset + dc] = 1;
            }
        });
    }, []);

    // Step the simulation
    const stepSimulation = useCallback(() => {
        const { rows, cols } = dimsRef.current;
        const current = gridRef.current;
        if (!current || !current.length) return;

        const next = createEmptyGrid(rows, cols);
        let currentPop = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let neighbors = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = (r + dr + rows) % rows;
                        const nc = (c + dc + cols) % cols;
                        if (current[nr] && current[nr][nc]) neighbors++;
                    }
                }

                const isAlive = current[r] && current[r][c];
                if (isAlive) {
                    if (neighbors === 2 || neighbors === 3) {
                        next[r][c] = 1;
                        currentPop++;
                    }
                } else {
                    if (neighbors === 3) {
                        next[r][c] = 1;
                        currentPop++;
                    }
                }
            }
        }

        // Auto-respawn if simulation dies or stagnates to 0
        if (currentPop === 0) {
            gridRef.current = createRandomGrid(rows, cols);
            setPopulation(Math.floor((rows * cols) * 0.25));
            return;
        }

        gridRef.current = next;
        setGeneration(g => g + 1);
        setPopulation(currentPop);
    }, []);

    // Render Canvas Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const isDark = theme === 'dark';
        const isBrutal = aesthetic === 'brutal';
        const isClay = aesthetic === 'clay';
        const isGlass = aesthetic === 'glass';

        // Theme-specific color parameters
        let primaryColor = isDark ? '#df4418' : '#e63900';
        let aliveGlow = 'rgba(223, 68, 24, 0.4)';
        let cellBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        if (isBrutal) {
            primaryColor = isDark ? '#00FF66' : '#000000';
            aliveGlow = isDark ? 'rgba(0, 255, 102, 0.5)' : 'rgba(0, 0, 0, 0.2)';
            cellBg = isDark ? '#141414' : '#FFE800';
        } else if (isClay) {
            primaryColor = isDark ? '#FF6B4A' : '#FF5436';
            aliveGlow = 'rgba(255, 107, 74, 0.3)';
        } else if (isGlass) {
            primaryColor = isDark ? '#00F0FF' : '#0066FF';
            aliveGlow = isDark ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 102, 255, 0.3)';
        }

        const render = (time) => {
            // Tick simulation every 140ms when running
            if (isRunning && time - lastTickRef.current > 140) {
                lastTickRef.current = time;
                stepSimulation();
            }

            const { rows, cols, width, height } = dimsRef.current;
            ctx.clearRect(0, 0, width, height);

            const grid = gridRef.current;
            if (!grid || !grid.length) {
                animFrameRef.current = requestAnimationFrame(render);
                return;
            }

            const cellW = CELL_SIZE;
            const cellH = CELL_SIZE;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = c * cellW;
                    const y = r * cellH;
                    const alive = grid[r] && grid[r][c];

                    if (alive) {
                        ctx.fillStyle = primaryColor;
                        if (!isBrutal) {
                            ctx.shadowColor = aliveGlow;
                            ctx.shadowBlur = 5;
                        } else {
                            ctx.shadowBlur = 0;
                        }

                        if (isBrutal) {
                            // Hard square pixel with crisp edge
                            ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
                            ctx.strokeStyle = isDark ? '#003311' : '#000000';
                            ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
                        } else if (isClay) {
                            // Pillowy 3D sphere / orb
                            const radius = (cellW / 2) * 0.85;
                            ctx.beginPath();
                            ctx.arc(x + cellW / 2, y + cellH / 2, radius, 0, Math.PI * 2);
                            ctx.fill();

                            // Specular 3D highlight
                            ctx.fillStyle = 'rgba(255,255,255,0.7)';
                            ctx.beginPath();
                            ctx.arc(x + cellW * 0.38, y + cellH * 0.38, radius * 0.3, 0, Math.PI * 2);
                            ctx.fill();
                        } else if (isGlass) {
                            // Glowing rounded bead
                            const pad = 1.5;
                            ctx.beginPath();
                            ctx.roundRect(x + pad, y + pad, cellW - pad * 2, cellH - pad * 2, 3);
                            ctx.fill();
                        } else {
                            // Neumorphic rounded soft square
                            const pad = 1.5;
                            ctx.beginPath();
                            ctx.roundRect(x + pad, y + pad, cellW - pad * 2, cellH - pad * 2, 2.5);
                            ctx.fill();

                            // Embossed top edge glint
                            ctx.fillStyle = 'rgba(255,255,255,0.22)';
                            ctx.fillRect(x + pad + 0.5, y + pad + 0.5, cellW - pad * 2 - 1, 1);
                        }
                    } else {
                        // Dead cell: subtle tactile dot
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = cellBg;
                        const dotR = 1.2;
                        ctx.beginPath();
                        ctx.arc(x + cellW / 2, y + cellH / 2, dotR, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isRunning, stepSimulation, theme, aesthetic]);

    // Handle interactive drawing/painting on the canvas
    const handlePointerAction = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
        const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
        if (clientX === undefined || clientY === undefined) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const { rows, cols } = dimsRef.current;
        const c = Math.floor(x / CELL_SIZE);
        const r = Math.floor(y / CELL_SIZE);

        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            if (gridRef.current[r]) {
                gridRef.current[r][c] = 1;
                // Also seed adjacent neighbor for organic clusters
                if (r + 1 < rows && gridRef.current[r + 1]) gridRef.current[r + 1][c] = 1;
            }
        }
    };

    const handleMouseDown = (e) => {
        isDrawingRef.current = true;
        handlePointerAction(e);
    };

    const handleMouseMove = (e) => {
        if (!isDrawingRef.current) return;
        handlePointerAction(e);
    };

    const handleMouseUp = () => {
        isDrawingRef.current = false;
    };

    return (
        <div className={`flex flex-col justify-between h-full w-full select-none ${className}`}>
            {/* Header: Title + Telemetry + Controls */}
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-border/15">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-textMain font-bold truncate">
                        Game of Life
                    </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-[8px] text-textMuted px-1.5 py-0.5 rounded neu-pressed hidden xl:inline-block">
                        G:{generation}
                    </span>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="p-1 rounded-md neu-flat hover:neu-pressed text-textMuted hover:text-primary transition-all active:scale-95 cursor-pointer"
                        title={isRunning ? "Pause" : "Play"}
                    >
                        {isRunning ? <Pause size={10} /> : <Play size={10} />}
                    </button>
                    <button
                        onClick={spawnGlider}
                        className="p-1 rounded-md neu-flat hover:neu-pressed text-textMuted hover:text-primary transition-all active:scale-95 cursor-pointer"
                        title="Spawn Glider"
                    >
                        <Sparkles size={10} />
                    </button>
                    <button
                        onClick={resetGrid}
                        className="p-1 rounded-md neu-flat hover:neu-pressed text-textMuted hover:text-primary transition-all active:scale-95 cursor-pointer"
                        title="Randomize Matrix"
                    >
                        <RotateCcw size={10} />
                    </button>
                </div>
            </div>

            {/* Interactive Canvas Grid (Neumorphic Inset / Screen with dynamic column adaptation) */}
            <div
                ref={containerRef}
                className="relative flex-1 w-full min-h-[90px] rounded-xl neu-pressed overflow-hidden flex items-center justify-center cursor-crosshair group"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <canvas
                    ref={canvasRef}
                    className="block"
                    style={{ imageRendering: 'pixelated' }}
                />

                {/* Subtle hover prompt */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
                    <span className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-background/80 text-textMuted backdrop-blur-sm border border-border/20 shadow-sm">
                        Click / Drag to Spawn
                    </span>
                </div>
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between pt-1.5 mt-1 text-[8px] font-mono text-textMuted">
                <span className="truncate">
                    {dimsRef.current.cols}×{dimsRef.current.rows} Grid
                </span>
                <span className="text-primary font-bold">{population} cells</span>
            </div>
        </div>
    );
};

export default ConwaysGameOfLife;
