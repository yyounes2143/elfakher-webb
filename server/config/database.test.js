/**
 * Tests for database query wrapper
 */

const { query, pool } = require('./database');

// Mock pg Pool
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

describe('Database Query Wrapper', () => {
    let consoleLogSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test('should execute query successfully and return result', async () => {
        const mockResult = {
            rows: [{ id: 1, name: 'Test' }],
            rowCount: 1
        };
        pool.query.mockResolvedValueOnce(mockResult);

        const text = 'SELECT * FROM users WHERE id = $1';
        const params = [1];

        const result = await query(text, params);

        expect(pool.query).toHaveBeenCalledWith(text, params);
        expect(result).toEqual(mockResult);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('Query executed:'),
            expect.objectContaining({
                text: text.substring(0, 50),
                rows: 1
            })
        );
    });

    test('should handle query error and re-throw', async () => {
        const mockError = new Error('Database connection failed');
        pool.query.mockRejectedValueOnce(mockError);

        const text = 'SELECT * FROM users';
        const params = [];

        await expect(query(text, params)).rejects.toThrow('Database connection failed');

        expect(pool.query).toHaveBeenCalledWith(text, params);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Query error:',
            mockError.message
        );
    });

    test('should truncate long query text in logs', async () => {
        const mockResult = { rowCount: 0 };
        pool.query.mockResolvedValueOnce(mockResult);

        const longQuery = 'SELECT ' + 'a'.repeat(100) + ' FROM users';
        await query(longQuery, []);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                text: longQuery.substring(0, 50)
            })
        );
    });
});
