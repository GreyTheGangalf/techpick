export function normalize(values: number[]): number[] {
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (max == min){
        return values.map(() => 100);
    }

    return values.map((x) => ((x-min) / (max - min)) * 100);
}