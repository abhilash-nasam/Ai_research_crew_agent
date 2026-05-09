import { QueryClient } from '@tanstack/react-query';


export const queryClientInstance = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
/** @param {Array<string | undefined | null | false>} classes */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
