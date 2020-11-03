/**
 * シード可能乱数
 */
export class Random
{
    
    /** Xorshift 乱数生成用のシード */
    public static seed :number = 0;
    
    /**
     * Xorshift 乱数生成 [0-1]
     * @param seed シード値
     */
    public static random (seed = null)
    {
        var x :number = this.seed;
        if (seed != null) x = seed;
        x ^= (x << 13);
        x ^= (x << 17);
        x ^= (x << 5);
        this.seed = x;
        return x / 0x100000000 + 0.5;
    }
    /**
     * Xorshift min - max の範囲で乱数生成 (整数)
     * @param min 最小値
     * @param max 最大値
     * @param seed シード値
     */
    public static randInt (min, max, seed = null)
    {
        return Math.floor(this.rand(min, max + 1, seed));
    }
    /**
     * Xorshift min - max の範囲で乱数生成
     * @param min 最小値
     * @param max 最大値
     * @param seed シード値
     */
    public static rand (min, max, seed = null)
    {
        return this.random(seed) * (max - min) + min;
    }
    
}