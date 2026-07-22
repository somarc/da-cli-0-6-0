# da-cli 0.6.0 certification site

Public release-proof site for `@somarc/da-cli` 0.6.0.

- Preview: https://main--da-cli-0-6-0--somarc.aem.page/
- Live: https://main--da-cli-0-6-0--somarc.aem.live/
- Product: https://github.com/somarc/da-cli

## Source ownership

DA is the sole source of truth for authored HTML, JSON sheets, navigation, and footer content. This repository owns EDS code, DA-native certification pipelines, and immutable historical evidence. It must not contain authored-content mirrors or upload fixtures.

Use the local da-cli for every content, preview, publish, and audit operation:

```sh
DA="node /Users/mhess/aem/aem-code/da/da-cli/bin/da.js"
$DA --org somarc --repo da-cli-0-6-0 --branch main site doctor --agent --deep --format json
```

## Certification flow

Plan and execute preview certification from existing DA source:

```sh
$DA --org somarc --repo da-cli-0-6-0 --branch main pipeline run dogfood/certify.yaml --dry-run --format json
$DA --org somarc --repo da-cli-0-6-0 --branch main --commit pipeline run dogfood/certify.yaml --format json
```

Live promotion is a separate, explicit approval:

```sh
$DA --org somarc --repo da-cli-0-6-0 --branch main pipeline run dogfood/promote.yaml --dry-run --format json
$DA --org somarc --repo da-cli-0-6-0 --branch main --commit pipeline run dogfood/promote.yaml --format json
```

Neither pipeline uploads authored content from Git.
`dogfood/canonical-pages.txt` is the reviewed promotion manifest; it excludes
DA draft and failure-injection paths.

## Repository checks

```sh
npm ci
npm run check:da-source-truth
npm run lint
npm run audit:dependencies
npm run audit:release
```

`check:da-source-truth` fails if authored mirror/staging directories or the retired fixture-fed construction pipeline return.
