# list2shrink

This is a command line pipe that can be used to automatically generate an npm-shrinkwrap.json file.

## usage

```
npm list | list2shrink > npm-shrinkwrap.json
```

You can *shinkwrap* the versions used in your Node.js project by including a `npm-shrinkwrap.json` file next to your `package.json` file.  For example, if you have your project working when `npm list` says this:

<table>
  <tbody>
    <tr>
      <th align="center">Node.js Version < 5</th>
      <th align="center">Node.js Version >= 5</th>
    </tr>
    <tr>
      <td align="left">
```
├─┬ autoprefixer-core@5.2.1
  ├── browserslist@0.4.0
  ├── caniuse-db@1.0.30000387
  ├── num2fraction@1.2.2
  └─┬ postcss@4.1.16
    ├── es6-promise@2.3.0
    ├── js-base64@2.1.9
    └─┬ source-map@0.4.4
      └── amdefine@1.0.0
```
      </td>
      <td align="left">
```
+-- autoprefixer-core@5.2.1
  +-- browserslist@0.4.0
  +-- caniuse-db@1.0.30000387
  +-- num2fraction@1.2.2
  `-- postcss@4.1.16
    +-- es6-promise@2.3.0
    +-- js-base64@2.1.9
    `-- source-map@0.4.4
      `-- amdefine@1.0.0
```
      </td>
    </tr>
  </tbody>
</table>

However, when you move your project to another location and execute `npm install`, you get different versions.  For example:
```
+-- autoprefixer-core@5.2.1
  +-- browserslist@0.4.0
  +-- caniuse-db@1.0.30000694
  +-- num2fraction@1.2.2
  `-- postcss@4.1.16
    +-- es6-promise@2.3.0
    +-- js-base64@2.1.9
    `-- source-map@0.4.4
      `-- amdefine@1.0.1
```
Notice the different versions?

You can force the `npm install` to get the same versions by adding this `npm-shrinkwrap.json` file in the same directory as your `package.json` file:

```
{
  "dependencies": {
    "autoprefixer-core": {
      "version": "5.2.1",
      "from": "autoprefixer-core@5.2.1",
      "dependencies": {
        "browserslist": {
          "version": "0.4.0",
          "from": "browserslist@0.4.0"
        },
        "caniuse-db": {
          "version": "1.0.30000694",
          "from": "caniuse-db@1.0.30000694"
        },
        "num2fraction": {
          "version": "1.2.2",
          "from": "num2fraction@1.2.2"
        },
        "postcss": {
          "version": "4.1.16",
          "from": "postcss@4.1.16",
          "dependencies": {
            "es6-promise": {
              "version": "2.3.0",
              "from": "es6-promise@2.3.0"
            },
            "js-base64": {
              "version": "2.1.9",
              "from": "js-base64@2.1.9"
            },
            "source-map": {
              "version": "0.4.4",
              "from": "source-map@0.4.4",
              "dependencies": {
                "amdefine": {
                  "version": "1.0.1",
                  "from": "amdefine@1.0.1"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

The problem is that it's a pain in the neck to make that `*.json` file.  So, if you've got your project working and you want to shrinkwrap it, you can use this to generate the `npm-shrinkwrap.json` file.

*Hint*:  Save your npm list in a file like this:
```
npm list | NpmList.txt
```
Later on, you can generate an `npm-shrinkwrap.json` file like this:
```
cat NpmList.txt | list2shrink > npm-shrinkwrap.json
```
