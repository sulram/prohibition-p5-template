# prohibition-p5-template

This template was originally created for [The Distance in Between
](https://prohibition.art/project/the-distance-in-between) by Fesq

### install dependencies

```
pnpm i
```

### run project

```
pnpm dev
```

### compile art script

```
pnpm compile
```

now copy `compiled/bundle.min.js` to art code field

### feature script

copy `src/params.js` to feature script field, without `export`

### batch export

project must be running

```
pnpm dev
```

in another terminal window, run

```
pnpm batch 100
```

and 100 images will be saved on `export` directory