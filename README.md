<h1 align="center">
  <img height="180px" src="https://github.com/raito-io/docs/raw/main/images/Raito_Logo_Vertical_RGB.png" alt="Raito" />
</h1>

<h4 align="center">
  GitHub Action for the Raito CLI
</h4>

<hr/>

# Raito CLI - GitHub Action

## Example Usage

```yaml
steps:
  - uses: raito-io/cli-setup@v1
```

## Building

### Prerequisites

Make sure you have Node.js installed (v16+).

Also install ncc:

```
npm i -g @vercel/ncc
```

### Building and Releasing

Run the following to download all dependencies:

```
npm install
```

Then, you can build the (single file) distribution using:

```
ncc build
```
