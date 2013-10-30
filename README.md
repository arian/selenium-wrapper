# Running selenium tests with `wd`.

## Installation

```bash
# to download selenium and the chrome webdriver
npm install selenium-wrapper -g
```

## Run selenium

```bash
# first start selenium and chrome driver
selenium
```

# Run the tests

```bash
# then run the tests
mocha tests/ --browser=phantomjs
mocha tests/ --browser=chrome
mocha tests/ --browser=firefox
```

## wd API

Examples can be found in the [wd repository](https://github.com/admc/wd)

API docs can be found in the [wd documentation](https://github.com/admc/wd/blob/master/doc/jsonwire-mapping.md)
