export function normalize(values: number[], lowerIsBetter: boolean = false): number[] {
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (max === min){
        return values.map(() => 100);
    }

    return values.map((x) => {
        const distance = lowerIsBetter ? max - x : x - min;
        return(distance / (max - min)) * 100;
    });
}