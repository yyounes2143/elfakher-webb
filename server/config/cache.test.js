/**
 * Tests for Simple In-Memory Cache
 */

const cache = require('./cache');

describe('In-Memory Cache', () => {
    let consoleLogSpy;

    beforeEach(() => {
        cache.clearTailoringOptions();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test('should return null when cache is empty', () => {
        const result = cache.getTailoringOptions();
        expect(result).toBeNull();
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    test('should set and get tailoring options', () => {
        const testData = { option1: 'value1' };
        cache.setTailoringOptions(testData);
        expect(consoleLogSpy).not.toHaveBeenCalled();

        const result = cache.getTailoringOptions();
        expect(result).toEqual(testData);
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    test('should return null after TTL expired', () => {
        const testData = { option1: 'value1' };
        cache.setTailoringOptions(testData);

        // Mock Date.now to simulate time passing
        const now = Date.now();
        const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(now + 11 * 60 * 1000);

        const result = cache.getTailoringOptions();
        expect(result).toBeNull();
        expect(consoleLogSpy).not.toHaveBeenCalled();

        dateSpy.mockRestore();
    });

    test('should clear tailoring options', () => {
        const testData = { option1: 'value1' };
        cache.setTailoringOptions(testData);
        cache.clearTailoringOptions();

        const result = cache.getTailoringOptions();
        expect(result).toBeNull();
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });
});
