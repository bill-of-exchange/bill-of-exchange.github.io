// Geometry of the bill's engraving-style ornaments, as SVG path data.

/** One sine wave along the segment from (fromX, fromY) to (toX, toY). */
function wavePath(fromX: number, fromY: number, toX: number, toY: number,
                  amplitude: number, period: number, phase: number): string {
    const length = Math.hypot(toX - fromX, toY - fromY);
    const alongX = (toX - fromX) / length;
    const alongY = (toY - fromY) / length;
    const points: string[] = [];
    for (let distance = 0; distance <= length; distance += 3) {
        const offset = amplitude * Math.sin((2 * Math.PI * distance) / period + phase);
        // Offset perpendicular to the segment: (-alongY, alongX) is its normal.
        const x = fromX + alongX * distance - alongY * offset;
        const y = fromY + alongY * distance + alongX * offset;
        points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return `M${points.join(' L')}`;
}

/**
 * The guilloche border: on each side of a width × height sheet, four phase-shifted sine waves
 * interlace into the classic banknote pattern.
 */
export function guillocheBorderPaths(width: number, height: number, inset: number, amplitude: number): string[] {
    const sides = [
        [inset, inset, width - inset, inset],
        [width - inset, inset, width - inset, height - inset],
        [width - inset, height - inset, inset, height - inset],
        [inset, height - inset, inset, inset],
    ];
    const phases = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    return sides.flatMap(([fromX, fromY, toX, toY]) =>
        phases.map((phase) => wavePath(fromX, fromY, toX, toY, amplitude, 24, phase)));
}

/** An epicycloid-like rosette centred in a size × size square. */
function rosettePath(size: number, majorRadius: number, minorRadius: number, lobes: number): string {
    const center = size / 2;
    const points: string[] = [];
    for (let step = 0; step <= 720; step++) {
        const t = (2 * Math.PI * step) / 720;
        const x = center + majorRadius * Math.cos(t) + minorRadius * Math.cos(lobes * t);
        const y = center + majorRadius * Math.sin(t) - minorRadius * Math.sin(lobes * t);
        points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return `M${points.join(' L')}`;
}

/** Three overlaid rosettes in a 160 × 160 box, drawn behind the denomination. */
export const ROSETTE_SIZE = 160;
export const ROSETTE_PATHS: readonly string[] = [
    rosettePath(ROSETTE_SIZE, 50, 24, 11),
    rosettePath(ROSETTE_SIZE, 46, 28, 13),
    rosettePath(ROSETTE_SIZE, 32, 16, 9),
];
