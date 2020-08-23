# kubenuke

[![GitHub stars](https://img.shields.io/github/stars/codejamninja/kubenuke.svg?style=social&label=Stars)](https://github.com/codejamninja/kubenuke)

> nuke a stuck kubernetes namespace

**WARNING: this can leave orphaned resources**

This tool will remove pesky namespaces that are stuck terminating. It follows the process spelled out by IBM at the following link.

[https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/troubleshoot/ns_terminating.html](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/troubleshoot/ns_terminating.html)

Please ★ this repo if you found it useful ★ ★ ★

## Installation

```sh
npm install -g kubenuke
```

## Usage

```
USAGE
  $ kubenuke ns NS

OPTIONS
  -a, --api-url=api-url
  -d, --debug
  -t, --timeout=timeout
  -y, --yes
  --token=token

EXAMPLE
  $ kubenuke ns some-ns
```

## Dependencies

- [NodeJS](https://nodejs.org)

## Support

Submit an [issue](https://github.com/codejamninja/kubenuke/issues/new)

## Screenshots

[Contribute](https://github.com/codejamninja/kubenuke/blob/master/CONTRIBUTING.md) a screenshot

## Contributing

Review the [guidelines for contributing](https://github.com/codejamninja/kubenuke/blob/master/CONTRIBUTING.md)

## License

[MIT License](https://github.com/codejamninja/kubenuke/blob/master/LICENSE)

[Jam Risser](https://codejam.ninja) © 2020

## Changelog

Review the [changelog](https://github.com/codejamninja/kubenuke/blob/master/CHANGELOG.md)

## Credits

- [Jam Risser](https://codejam.ninja) - Author

## Support on Liberapay

A ridiculous amount of coffee ☕ ☕ ☕ was consumed in the process of building this project.

[Add some fuel](https://liberapay.com/codejamninja/donate) if you'd like to keep me going!

[![Liberapay receiving](https://img.shields.io/liberapay/receives/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
[![Liberapay patrons](https://img.shields.io/liberapay/patrons/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
