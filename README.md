# SPARQL Executor README

The SPARQL Executor Visual Studio Code extension is a simple utility which allows you to configure SPARQL end-points and execute SPARQL queries.

## Features

### Configure Multiple SPARQL Endpoints

Open `settings.json` in Visual Studio Code and add SPARQL endpoints:

![Configure Multiple SPARQL Endpoints](images/configure-multiple-sparql-endpoints.png)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

### Select From SPARQL Endpoints

#### Select SPARQL Endpoint Using Command Palette

- `cmd` + `shift` + `P`
- Type the command `Select SPARQL Endpoint`
- Hit `enter`
- Search for and highlight your desired endpoint
- Hit `enter`

![Select SPARQL Endpoints](images/select-sparql-endpoint.gif)

#### Select SPARQL Endpoint Using Key Command

The default key command for selecting a SPARQL endpoint is: `control` + `shift` + `E`.

### Execute SPARQL Queries

#### Execute SPARQL Query Using Command Palette

- `cmd` + `shift` + `P`
- Type the command `Execute SPARQL Query`
- Hit `enter`

![Execute SPARQL Queries](images/execute-sparql-query.gif)

#### Execute SPARQL Query Using Key Command

The default key command for executing a SPARQL query is: `control` + `shift` + `X`.

## Extension Settings

This extension contributes the following settings:

- `sparql-executor.endpoints`: configured list of SPARQL endpoints
- `sparql-executor.endpoints.protocol`: SPARQL endpoint protocol (`https` or `http`)
- `sparql-executor.endpoints.host`: SPARQL endpoint host, e.g. `example.com` (do not include a path)
- `sparql-executor.endpoints.path`: SPARQL endpoint path, e.g. `/sparql`
- `sparql-executor.endpoints.method`: SPARQL endpoint HTTP method, e.g. `GET` (defaults to `POST`)
- `sparql-executor.endpoints.queryParameterName`: Custom SPARQL query post data/query string parameter name, e.g. `query`
- `sparql-executor.endpoints.output`: SPARQL results output formar, e.g. `table` (defaults to `json`)
- `sparql-executor.endpoints.customHeaders`: Define custom headers to be included in the SPARQL request
- `sparql-executor.endpoints.customHeaders.[].headerName`: Name of the custom header
- `sparql-executor.endpoints.customHeaders.[].headerValue`: Value of the custom header
- `sparql-executor.endpoints.authentication`: SPARQL endpoint authentication configuration
- `sparql-executor.endpoints.authentication.type`: SPARQL endpoint authentication type (currently only supports `basic`)
- `sparql-executor.endpoints.authentication.username`: SPARQL endpoint authentication username (for basic auth)
- `sparql-executor.endpoints.authentication.password`: SPARQL endpoint authentication password (for basic auth)

### 1.0.0

Initial release of SPARQL Executor which can simply:

- Configure multiple SPARQL endpoints with:
  - Protocol
  - Host
  - Authentication (currently _only_ basic auth)
- Execute SPARQL queries and updates

### 1.1.0

- Adds support for SPARQL results output in JSON
- Fixes VS code status bar issue when SPARQL query fails

### 1.1.1

- Fixes issue where focus is pulled away from SPARQL query in editor to output console when showing SPARQL query results in JSON output format

### 1.1.2

- Update of dependencies
