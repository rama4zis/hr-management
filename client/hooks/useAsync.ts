import { useState, useEffect, useCallback } from 'react';

export function useAsync<T>(
    asyncFunction: () => Promise<T>,
    dependencies: any[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await asyncFunction();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('useAsync error:', err);
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        execute();
    }, [execute]);

    return { data, loading, error, refetch: execute };
}

export function useAsyncCallback<T, Args extends any[]>(
    asyncFunction: (...args: Args) => Promise<T>
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (...args: Args): Promise<T | null> => {
        try {
            setLoading(true);
            setError(null);
            const result = await asyncFunction(...args);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('useAsyncCallback error:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [asyncFunction]);

    return { execute, loading, error };
}
