## Development

### For development

#### Building

```console
yarn build:dev
```

#### Serving

```console
yarn start:dev
```

### For production

```console
yarn build:prod
```

## Testing

```console
yarn test
```

## Docs with jsdoc

```console
yarn jsdoc
```

Output is in [`docs/jsdoc`]('/docs/jsdoc/index.html')

## Publishing

Run `yarn build:prod` before publishing

```console
npm version patch // minor, major
```

```console
npm publish
```
