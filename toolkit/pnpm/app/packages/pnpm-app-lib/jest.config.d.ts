declare const _default: {
    rootDir: string;
    preset: string;
    testEnvironment: string;
    transform: {
        '^.+\\.ts?$': ["ts-jest", {
            useESM: true;
        }];
    };
    extensionsToTreatAsEsm: string[];
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': string;
        '^@/(.*)$': string;
    };
    testPathIgnorePatterns: string[];
};
export default _default;
