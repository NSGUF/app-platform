module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'standard',
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'vue'
    ],
    rules: {
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline']
    }
};
