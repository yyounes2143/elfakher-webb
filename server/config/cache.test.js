/**
 * Tests for Cache Configuration
 */

const cache = require('./cache');

describe('Cache Configuration', () => {
    let consoleLogSpy;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2023-01-01'));
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        // Reset cache state
        cache.clearTailoringOptions();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        jest.useRealTimers();
    });

    test('should initially return null for tailoring options (Cache Miss)', () => {
        const options = cache.getTailoringOptions();
        expect(options).toBeNull();
        expect(consoleLogSpy).toHaveBeenCalledWith('Cache Miss: tailoringOptions');
    });

    test('should store and retrieve tailoring options (Cache Hit)', () => {
        const mockData = { test: 'data' };
        cache.setTailoringOptions(mockData);
        expect(consoleLogSpy).toHaveBeenCalledWith('Cache Set: tailoringOptions');

        const options = cache.getTailoringOptions();
        expect(options).toEqual(mockData);
        expect(consoleLogSpy).toHaveBeenCalledWith('Cache Hit: tailoringOptions');
    });

    test('should return null after cache is cleared', () => {
        const mockData = { test: 'data' };
        cache.setTailoringOptions(mockData);
        cache.clearTailoringOptions();
        expect(consoleLogSpy).toHaveBeenCalledWith('Cache Cleared: tailoringOptions');

        const options = cache.getTailoringOptions();
        expect(options).toBeNull();
    });

    test('should return null if TTL has expired', () => {
        const mockData = { test: 'data' };
        cache.setTailoringOptions(mockData);

        // Advance time by 11 minutes (TTL is 10 minutes)
        jest.advanceTimersByTime(11 * 60 * 1000);

        const options = cache.getTailoringOptions();
        expect(options).toBeNull();
        expect(consoleLogSpy).toHaveBeenCalledWith('Cache Miss: tailoringOptions');
    });

    test('should return data if within TTL', () => {
        const mockData = { test: 'data' };
        cache.setTailoringOptions(mockData);

        // Advance time by 9 minutes
        jest.advanceTimersByTime(9 * 60 * 1000);

        const options = cache.getTailoringOptions();
        expect(options).toEqual(mockData);
        expect(consoleLogSpy).toHaveBeenCalledWith('Cache Hit: tailoringOptions');
    });
});
