const _ = require('lodash')
const vscode = require('vscode')
const request = require('request-promise-native')
const tableify = require('tableify')
const SparqlParser = require('sparqljs').Parser
const fs = require('fs')
const handlebars = require('handlebars')
const parser = new SparqlParser()
const path = require('path')

/**
 * Constants.
 */
const EXTENSION_NAME = 'sparql-executor'

const AUTH_TYPE = {
  BASIC: 'basic'
}

const OUTPUT = {
  JSON: 'json',
  TABLE: 'table'
}

const COMMAND = {
  SELECT_SPARQL_ENDPOINT: 'extension.select-sparql-endpoint',
  EXECUTE_SPARQL_QUERY: 'extension.execute-sparql-query'
}

const STATE_KEY = {
  CURRENT_SPARQL_ENDPOINT: 'CURRENT_SPARQL_ENDPOINT'
}

const MESSAGE_ITEM = {
  SELECT_SPARQL_ENDPOINT: 'Select SPARQL Endpoint'
}

/**
 * Select the SPARQL configuration to use when executing queries.
 *
 * @param {vscode.ExtensionContext} context
 */
const selectSparqlConfig = async context => {
  const endpoints = _.get(vscode.workspace.getConfiguration(EXTENSION_NAME), 'endpoints', [])

  if (!endpoints || !endpoints.length) {
    vscode.window.showErrorMessage('No SPARQL endpoints configured')
  }

  const endpointNames = _.map(endpoints, 'name')
  const selectedEndpointName = await vscode.window.showQuickPick(endpointNames, {
    canPickMany: false
  })

  if (selectedEndpointName) {
    context.workspaceState.update(STATE_KEY.CURRENT_SPARQL_ENDPOINT, selectedEndpointName)
    vscode.window.showInformationMessage(`SPARQL endpoint set to '${selectedEndpointName}'`)
  }
}

/**
 * Get the currently selected endpoint.
 *
 * @param {vscode.ExtensionContext} context
 */
const getSparqlEndpoint = context => {
  const endpointName = context.workspaceState.get(STATE_KEY.CURRENT_SPARQL_ENDPOINT)

  if (!endpointName) {
    vscode.window.showErrorMessage('No SPARQL endpoint set', MESSAGE_ITEM.SELECT_SPARQL_ENDPOINT).then(item => {
      if (item === MESSAGE_ITEM.SELECT_SPARQL_ENDPOINT) {
        selectSparqlConfig(context)
      }
    })

    return
  }

  const endpoints = _.get(vscode.workspace.getConfiguration(EXTENSION_NAME), 'endpoints')

  return _.find(endpoints, { name: endpointName })
}

const getSparqlQueryType = query => {
  const parsedQuery = parser.parse(query)

  return parsedQuery.type
}

const renderAsTable = (results, context) => {
  const panel = vscode.window.createWebviewPanel('sparqlResultsTable', 'SPARQL Query Results', vscode.ViewColumn.One, {
    localResourceRoots: [vscode.Uri.file(context.extensionPath)]
  })
  const htmlTable = tableify(results)
  const htmlFilePath = vscode.Uri.file(path.join(context.extensionPath, 'results.handlebars'))
  const cssFilePath = vscode.Uri.file(path.join(context.extensionPath, 'styles.css'))
  const stylesheetHref = cssFilePath.with({ scheme: 'vscode-resource' })
  const html = fs.readFileSync(htmlFilePath.fsPath, 'utf8')
  const template = handlebars.compile(html)

  panel.webview.html = template({ htmlTable, stylesheetHref })
  panel.reveal()
}

const renderAsJson = results => {
  const outputChannel = vscode.window.createOutputChannel(`SPARQL Results`)
  outputChannel.append(JSON.stringify(results, null, '\t'))
  outputChannel.show(true)
}

/**
 * Execute a SPARQL query against the currently selected endpoint.
 *
 * @param {vscode.ExtensionContext} context
 */
const executeSparqlQuery = async context => {
  const endpointConfiguration = getSparqlEndpoint(context)

  if (!endpointConfiguration) {
    return
  }

  const { protocol, host, output, authentication: { type, username, password } = {} } = endpointConfiguration
  const url = `${protocol}://${host}/sparql`
  const query = vscode.window.activeTextEditor.document.getText()
  const queryType = getSparqlQueryType(query)

  const options = {
    method: 'POST',
    url: url,
    headers: {
      Accept: 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: { [queryType]: query }
  }

  if (type === AUTH_TYPE.BASIC && username && password) {
    options.headers.Authorization = 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
  }

  vscode.window.setStatusBarMessage('Executing SPARQL query...')

  let responseJson

  try {
    responseJson = await request(options)
  } catch (error) {
    vscode.window.showErrorMessage(`Something went wrong when executing the SPARQL query: '${error}'`)
    return
  } finally {
    vscode.window.setStatusBarMessage(undefined)
  }

  const response = JSON.parse(responseJson)
  const values = []

  if (!response || !response.results || !response.results.bindings || !response.results.bindings.length) {
    vscode.window.showInformationMessage('No results')
    return
  }

  _.each(response.results.bindings, binding => {
    const newBinding = {}

    _.each(binding, (value, key) => {
      newBinding[key] = value.value
    })

    values.push(newBinding)
  })

  if (output === OUTPUT.TABLE) {
    renderAsTable(values, context)
  } else {
    renderAsJson(values)
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = context => {
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND.SELECT_SPARQL_ENDPOINT, () => selectSparqlConfig(context)))
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND.EXECUTE_SPARQL_QUERY, () => executeSparqlQuery(context)))
}
exports.activate = activate

// this method is called when your extension is deactivated
const deactivate = () => {}

module.exports = {
  activate,
  deactivate
}
