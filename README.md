## ProportionalImage React component

[Read API docs](https://confirmitasa.github.io/ProportionalImage)

`ProportionalImage` is an element for displaying an image that provides useful sizing and preloading options not found on the standard `<img>` tag.
The `sizing` option allows the image to be either cropped (`cover`) or letterboxed (`contain`) to fill a fixed user-size placed on the element.
The `preload` option prevents the browser from rendering the image until the image is fully loaded.
In the interim, either the element's CSS `background-color` can be be used as the placeholder, or the `placeholder` property can be set to a URL (preferably a data-URI, for instant rendering) for a placeholder image.
The `fade` option (only valid when `preload` is set) will cause the placeholder image/color to be faded out once the image is rendered.

Examples:
Basically identical to `<img src="...">` tag:
```
<ProportionalImage width="200" height="200" src="http://lorempixel.com/400/400" />
```
Will letterbox the image to fit and use styles rather than the attributes to set height and width:
```
<ProportionalImage style={{width:'400px', height:'400px'}} sizing="contain" src="http://lorempixel.com/600/400" />
```
Will crop the image to fit:
```
<ProportionalImage style={{width:'400px', height:'400px'}} sizing="cover" src="http://lorempixel.com/600/400" />
```
Will show light-gray background until the image loads:
```
<ProportionalImage style={{width:'400px', height:'400px', backgroundColor: 'lightgray'}} sizing="cover" preload="true" src="http://lorempixel.com/600/400" />
```
Will show a base-64 encoded placeholder image until the image loads:
```
<ProportionalImage style={{width:'400px', height:'400px'}} placeholder="data:image/gif;base64,..." sizing="cover" preload="true" src="http://lorempixel.com/600/400" />
```
Will fade the light-gray background out once the image is loaded:
```
<ProportionalImage style={{width:'400px', height:'400px', backgroundColor: 'lightgray'}} sizing="cover" preload="true" fade="true" src="http://lorempixel.com/600/400" />
```
Will disregard the height, because the aspect is provided, and reduce the image height to be in 16:9 ratio. Specifying height in this case is not necessary
```
<ProportionalImage aspect="16:9" style={{width:'400px', height:'400px', backgroundColor: 'lightgray'}} sizing="cover" preload="true" fade="true" src="http://lorempixel.com/600/400" />
```
If you don't want to stretch a placeholder, but display it in its natural size even if the main image uses `sizing`, feel free to use a PostCSS mixin `--ProportionalImage-placeholder` to restyle it:
```css
:root{
 --ProportionalImage-placeholder: {
   background-color: #f0f2f5;
   background-size: auto !important;
 };
}
```

You may try this bit of code to see how it works:
```postcss
/* your variables file included prior to the ProportionalImage module include */
:root{
 --ProportionalImage-placeholder: {
   background-color: #f0f2f5;
   background-size: auto !important;
 };
}
```

```javascript
//javascript code
ReactDOM.render(
  <div style={{width:'300px', height:'600px'}}><ProportionalImage
    src="https://static.pexels.com/photos/2242/wall-sport-green-bike.jpg"
    placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA90lEQVR4Ae2XPUrGQBRFRxAEO12BVQiWrsHCZQQsXYSrsEuRHeSnsHELthZWruALIYlYiBwrxVsEnslMlXduNQMvB+6DkITYOA45DSNrmenICX8jB3IGtjKoQgUNMWiXBSMxmJYFsXCBC1zgAhdYKalSCp454ZSXVIIDFwQCl7xvF5Q8oHxx8ztRrBNoFcc8yd29zFTrBFrFGa/88MiRzOgmsAu0iowegDfOZUI38U+BVnHNJx9cyZ1swijQKiR33MpZN2EXaBW2yCYMAq3CENmEQaBVWFPs4W06p/747YhBnfYHpCdDBaqgZdpQTq2PV0H8uGAfgm/CGielQREouQAAAABJRU5ErkJggg=="
    sizing="cover"
    width="100%"
    height="200"
    fade="true"
    preload="true"
    alt="bicycle"
    aspect="1:1"
  /></div>,
  document.querySelector("#root")
);
```

### Commands (configured in package.json)

- `npm install` installs all dependencies of the project
- `npm run build:prd` generates minified build files under `/dist` folder 
- `npm run build:dev` generates build files under `/dist` folder and starts watching all changes made to the project during this session, appending them to the build files
- `npm test` Runs tests that have been written and put into `/src/__tests__` folder. (Note: test should follow name convention: `NameOfClass-test.js` which is a test for `NameOfFile.js`)
- `npm run lint` Lints your JavaScript code placed in src folder.
- `npm run docs` generates documentation for your project `.js` files that use JSDoc3 comments and puls them into `docs` folder
- `npm run docs-commit`  publishes documentation to `http://ConfirmitASA.github.io/[RepoName]/[version]/` where `[RepoName]` is name of your repository as well as name specified in `package.json -> name` AND `[version]` is the version in your `package.json`. 
Please make sure you have the `npm run docs-commit` command configured properly with the correct name of repo to be used there.
