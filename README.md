# node-composite-action

Denne bygger, kjører tester, og deployer en statisk webapplikasjon basert på npm til azure.

### Eksempel på å bygge en branch

Lag filen .github/workflows/branches_build_image_with_buildnumber.yml

```
name: build
on:
  push:
    branches-ignore:
      - main
jobs:
  build:
    runs-on: aks-runner
    steps:
      - id: checkout
        uses: actions/checkout@v2
      - name: Hent versjon fra branch
        id: prep
        uses: skatteetaten-it/mvn-composite-action/version@v1
        with:
          type: "branch"

      - uses: skatteetaten-it/node-composite-action@v1
        with:
          nexus-user: ${{ secrets.NEXUS_USERNAME }}
          nexus-pass: ${{ secrets.NEXUS_PASSWORD }}
          image-name: ghcr.io/skatteetaten-it/skyklar-pilot/referanse-web:${{ steps.prep.outputs.version }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Eksempel på å bygge en relase

Lag filen .github/workflows/release.yml

```
name: release

on:
  release:
    types: # This configuration does not affect the page_build event above
      - created

jobs:
  build:
    runs-on: aks-runner
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Hent versjon
        id: prep
        uses: skatteetaten-it/mvn-composite-action/version@v1
        with:
          type: "release"
      - uses: skatteetaten-it/node-composite-action@v1
        with:
          nexus-user: ${{ secrets.NEXUS_USERNAME }}
          nexus-pass: ${{ secrets.NEXUS_PASSWORD }}
          image-name: ghcr.io/skatteetaten-it/skyklar-pilot/referanse-web:${{ steps.prep.outputs.version }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Hoved action skatteetaten-it/node-composite-action@v1

Denne bygger, kjører tester, publiser til sonar og deployer en statisk webapplikasjon basert på npm.

parametre er:

- nexus-user (Nexus brukernavn, skal være en secret) 
- nexus-pass (Nexus passord, skal være en secret)
- github-token (github token, er en secret som kommer fra github)
- image-name (lokasjon til docker image som blir bygd, denne bør inneholde et versjonsnummer, se skatteetaten-it/mvn-composite-action/version)
