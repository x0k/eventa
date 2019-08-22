module.exports = {
    "extends": "standard",
    "parser": "babel-eslint",
    "plugins": [
        "eslint-plugin-react",
        "jsx-a11y",
        "react-hooks"
    ],
    "env": {
        "browser": true
    },
    "rules": {
        "react/jsx-uses-vars": "error",
        "react/jsx-uses-react": "error"
    }
};