# Change Log

All notable changes to the "sparql-executor" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Released]

## [1.0.0] - 2019-03-13

### Added

- A way to configure simple SPARQL endpoints with `protocol`, `host`, `authentication` (currently only basic auth)
- Ability to execute a SPARQL query which is in the active document against a SPARQL endpoint selected from one of those configured

## [1.1.0] - 2019-08-14

### Added

- New JSON format for SPARQL query results which is rendered in the output console. This can be configured in settings.json.

### Fixed

- Issue where VS Code status bar wasn't updating when SPARQL queries failed

## [1.1.1] - 2019-08-14

### Fixed

- Issue where focus is pulled away from SPARQL query in editor to output console when showing SPARQL query results in JSON output format
