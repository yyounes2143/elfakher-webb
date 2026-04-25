/**
 * Simple In-Memory Cache for Static Options
 * مخزن مؤقت بسيط في الذاكرة للخيارات الثابتة
 */

const cache = {
    tailoringOptions: null,
    lastFetched: 0,
    TTL: 10 * 60 * 1000 // 10 minutes (10 دقائق)
};

module.exports = {
    /**
     * الحصول على خيارات التفصيل من الكاش
     */
    getTailoringOptions: () => {
        const now = Date.now();
        if (cache.tailoringOptions && (now - cache.lastFetched < cache.TTL)) {
            return cache.tailoringOptions;
        }
        return null;
    },

    /**
     * حفظ خيارات التفصيل في الكاش
     */
    setTailoringOptions: (data) => {
        cache.tailoringOptions = data;
        cache.lastFetched = Date.now();
    },

    /**
     * مسح الكاش (عند تحديث البيانات)
     */
    clearTailoringOptions: () => {
        cache.tailoringOptions = null;
        cache.lastFetched = 0;
    }
};
