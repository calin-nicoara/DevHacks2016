module.exports = {
  "env": {
    "browser": true
  },
  "extends": ["eslint:recommended", "angular"],
  "installedESLint": true,
  "rules": {
    "indent": [
      "off",
      2
    ],
    "angular/controller-name": ['warn'],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "warn",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  },
  "globals": {
    "_": true,
    "Stomp": true,
    "SockJS": true,
    "swal": true,
    "require": true
  }
};
