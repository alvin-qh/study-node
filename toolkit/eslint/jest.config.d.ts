declare const _default: {
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
};
export default _default;
