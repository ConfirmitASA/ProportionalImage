import React from 'react';
//import ReactDOM from 'react-dom';

class ProportionalImage extends React.Component {
  /**
   * `ProportionalImage` is an element for displaying an image that provides useful sizing and preloading options not found on the standard `<img>` tag.
   * The `sizing` option allows the image to be either cropped (`cover`) or letterboxed (`contain`) to fill a fixed user-size placed on the element.
   * The `preload` option prevents the browser from rendering the image until the image is fully loaded.
   * In the interim, either the element's CSS `background-color` can be be used as the placeholder, or the `placeholder` property can be set to a URL (preferably a data-URI, for instant rendering) for a placeholder image.
   * The `fade` option (only valid when `preload` is set) will cause the placeholder image/color to be faded out once the image is rendered.
   *
   * Examples:
   * Basically identical to `<img src="...">` tag:
   * ```
   * <ProportionalImage width="200" height="200" src="http://lorempixel.com/400/400" />
   * ```
   * Will letterbox the image to fit and use styles rather than the attributes to set height and width:
   * ```
   * <ProportionalImage style={{width:'400px', height:'400px'}} sizing="contain" src="http://lorempixel.com/600/400" />
   * ```
   * Will crop the image to fit:
   * ```
   * <ProportionalImage style={{width:'400px', height:'400px'}} sizing="cover" src="http://lorempixel.com/600/400" />
   * ```
   * Will show light-gray background until the image loads:
   * ```
   * <ProportionalImage style={{width:'400px', height:'400px', backgroundColor: 'lightgray'}} sizing="cover" preload="true" src="http://lorempixel.com/600/400" />
   * ```
   * Will show a base-64 encoded placeholder image until the image loads:
   * ```
   * <ProportionalImage style={{width:'400px', height:'400px'}} placeholder="data:image/gif;base64,..." sizing="cover" preload="true" src="http://lorempixel.com/600/400" />
   * ```
   * Will fade the light-gray background out once the image is loaded:
   * ```
   * <ProportionalImage style={{width:'400px', height:'400px', backgroundColor: 'lightgray'}} sizing="cover" preload="true" fade="true" src="http://lorempixel.com/600/400" />
   * ```
   * Will disregard the height, because the aspect is provided, and reduce the image height to be in 16:9 ratio. Specifying height in this case is not necessary
   * ```
   * <ProportionalImage aspect="16:9" style={{width:'400px', height:'400px', backgroundColor: 'lightgray'}} sizing="cover" preload="true" fade="true" src="http://lorempixel.com/600/400" />
   * ```
   * If you don't want to stretch a placeholder, but display it in its natural size even if the main image uses `sizing`, feel free to use a PostCSS mixin `--ProportionalImage-placeholder` to restyle it:
   * ```css
   * :root{
   *  --ProportionalImage-placeholder: {
   *    background-color: #f0f2f5;
   *    background-size: auto !important;
   *  };
   * }
   * ```
   *
   * @param {Object} props
   * @param {String} props.src - The URL of an image.
   * @param {String} props.alt - A short text alternative for the image.
   * @param {Boolean} props.preventLoad - When true, the image is prevented from loading and any placeholder is shown.  This may be useful when a binding to the src property is known to be invalid, to prevent 404 requests.
   * @param {String} props.sizing - Sets a sizing option for the image.  Valid values are `contain` (full aspect ratio of the image is contained within the element and letterboxed) or `cover` (image is cropped in order to fully cover the bounds of the element), or `null` (default: image takes natural size). Make sure you specify `height` and `width` if you use anything other thant `none` for `sizing`
   * @param {String} props.position - When a sizing option is used (`cover` or `contain`), this determines how the image is aligned within the element bounds.
   * @param {Boolean} props.preload - When `true`, any change to the `src` property will cause the `placeholder` image to be shown until the new image has loaded.
   * @param {Boolean} props.fade - When `preload` is true, setting `fade` to true will cause the image to fade into place.
   * @param {String} props.placeholder - This image will be used as a background/placeholder until the src image has loaded. Use of a data-URI for placeholder is encouraged for instant rendering.
   * @param {String} props.placeholderSizing - Sets a sizing option for the placeholder. By default it's the same as for the `src` image, but set to `initial` or other valid `background-size` value to override.
   * @param {String} props.width - Can be used to set the width of image (e.g. via binding); size may also be set via CSS.
   * @param {String} props.height - Can be used to set the height of image (e.g. via binding); size may also be set via CSS.
   * @param {String} props.aspect - Specify the aspect ratio to maintain, two numbers separated by semicolon(e.g. `16:9`). Make sure that the container for the image can resize vertically/ has enough space for it
   * */
  constructor(props){
    super(props);
    this._imageOnload = this._imageOnload.bind(this);
    this._imageOnerror = this._imageOnerror.bind(this);
    this.state = {
      src: '',
      placeholderHidden:!(!!this.props.placeholder),
      sizing: this.props.sizing?this.props.sizing:null,
      position: this.props.position?this.props.position:'center',
      proportion:0,
      loaded:false, //true when the image is loaded.
      loading:false, //tracks the loading state of the image when the `preload` option is used.
      error:false //indicates that the last set `src` failed to load.
    }
  }
  componentDidMount() {
    this._load();
    this._computeDimensions();
    this._computeProportion(this.props.aspect);
  }
  _computeDimensions(){
    this.setState({
      width:isNaN(this.props.width) ? this.props.width : this.props.width + 'px',
      height:isNaN(this.props.height) ? this.props.height : this.props.height + 'px'});
  }
  /**
   * Computes aspect ratio of the image
   * */
  _computeProportion(aspect){
    if(aspect){
      if(aspect.indexOf(':')>-1){
        let parts = aspect.split(':').map(part=>parseFloat(part));

        if(!isNaN(parts[0]) && !isNaN(parts[1])){
          this.setState(prevState=>{
            if(!isNaN(parseFloat(prevState.width))){
              return {
                proportion:(parseFloat(prevState.width) * (parts[1]/parts[0])).toString() + prevState.width.substring(parseFloat(prevState.width).toString().length),
                height: 'auto'
              }
            } else {
              //throw new TypeError('Width in ProportionalImage has to be either in pixels or in percent')
            }
          });
        }
      }
    }
  }

  render() {
    return (
      <div className="ProportionalImage"
           style={{
             width: this.state.width,
             height: this.state.height,
             paddingTop:this.state.proportion
           }}>
        <div className="sizedImgDiv"
             role="img"
             style={{
               backgroundImage: `url(${this.state.src})`,
               backgroundSize:this.state.sizing,
               backgroundPosition:this.state.position,
               backgroundRepeat: this.state.sizing ? 'no-repeat' : '',
               display: this.state.sizing? 'block':'none'
             }}
        ></div>
        <img
          src={this.state.src}
          alt={this.props.alt}
          onLoad={this._imageOnload}
          onError={this._imageOnerror}
          style={{
            display: this.state.sizing? 'none':'block'
          }}
        />
        <div
          style={{
            backgroundImage: `url(${this.props.placeholder?this.props.placeholder:''})`,
            backgroundSize: !this.props.placeholderSizing?this.state.sizing:this.props.placeholderSizing,
            backgroundPosition:this.state.position,
            backgroundRepeat: this.state.sizing ? 'no-repeat' : ''
          }}
          className={`imagePlaceholder ${this.state.placeholderHidden?'hidden':''} ${(this.props.preload && this.props.fade && !this.state.loading && this.state.loaded) ? 'faded-out' : ''}`}></div>
      </div>
    );
  }

  _imageOnload(){
    this.setState({
      loading:false,
      loaded:true,
      //placeholderHidden:true,
      error:false
    })
  }
  _imageOnerror(){
    this._reset();
    this.setState({
      loading:false,
      loaded:false,
      error:true
    })
  }
  _reset() {
    this.setState({
      src:'',
      loading:false,
      loaded:false,
      error:false
    });
  }
  _computeSRC(src){
    this.setState({
      src: src? src:'',
    });
    this.setState({
      loading:!!src,
      loaded:false,
      error:false
    });
  }
  _load(){
    this._reset();
    if(!this.props.preventLoad) {
      if (this.state.src != this.props.src) {
        this._computeSRC(this.props.src)
      }
    }
  }
}

export default ProportionalImage;

/*ReactDOM.render(
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
 );*/
