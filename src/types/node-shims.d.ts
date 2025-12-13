declare module 'node:assert' {
    const assert: typeof import('assert');
    export default assert;
}

declare module 'node:test' {
    export const test: typeof import('node:test')['test'];
}
