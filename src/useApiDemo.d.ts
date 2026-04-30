import type { UseSpacespotDemo } from './types';

// This file provides a module declaration for the JS hook so TypeScript can type-check imports.
declare module './useApiDemo' {
  const useSpacespotDemo: () => UseSpacespotDemo;
  export { useSpacespotDemo };
}
