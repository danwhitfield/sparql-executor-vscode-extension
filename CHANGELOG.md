# Change Log

All notable changes to the "sparql-executor" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2019-03-13

### Added

- A way to configure simple SPARQL endpoints with `protocol`, `host`, `authentication` (currently only basic auth)
- Ability to execute a SPARQL query which is in the active document against a SPARQL endpoint selected from one of those configured