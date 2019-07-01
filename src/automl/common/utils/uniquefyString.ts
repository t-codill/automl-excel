export const uniquefyString = (fields: string[]): string[] => {
    const s = new Set(fields);
    const m = new Map();
    return fields.map((f) => {
        const h = f.trim();
        if (!m.has(h)) {
            m.set(h, 0);
            return h;
        }
        let i = m.get(h);
        while (s.has(`${h}_${++i}`)) { continue; }
        m.set(h, i);
        return `${h}_${i}`;
    });
};
