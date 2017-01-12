/**
 * Created by IvanP on 11.01.2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styles from "./main.css";

class ProportionalImage extends React.Component {
  /**
   * @param {Object} props
   * @param {String} props.src - The URL of an image.
   * @param {String} props.alt - A short text alternative for the image.
   * @param {String} props.preventLoad - When true, the image is prevented from loading and any placeholder is shown.  This may be useful when a binding to the src property is known to be invalid, to prevent 404 requests.
   * @param {String} props.sizing - Sets a sizing option for the image.  Valid values are `contain` (full aspect ratio of the image is contained within the element and letterboxed) or `cover` (image is cropped in order to fully cover the bounds of the element), or `null` (default: image takes natural size).
   * @param {String} props.position - When a sizing option is used (`cover` or `contain`), this determines how the image is aligned within the element bounds.
   * @param {String} props.preload - When `true`, any change to the `src` property will cause the `placeholder` image to be shown until the new image has loaded.
   * @param {String} props.fade - When `preload` is true, setting `fade` to true will cause the image to fade into place.
   * @param {String} props.placeholder - This image will be used as a background/placeholder until the src image has loaded. Use of a data-URI for placeholder is encouraged for instant rendering.
   * @param {String} props.width - Can be used to set the width of image (e.g. via binding); size may also be set via CSS.
   * @param {String} props.height - Can be used to set the height of image (e.g. via binding); size may also be set via CSS.
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
      height:null,
      loaded:false, //true when the image is loaded.
      loading:false, //tracks the loading state of the image when the `preload` option is used.
      error:false //indicates that the last set `src` failed to load.
    }
  }
  componentDidMount() {
    this._load();
  }
  render() {
    return (
      <div className="ProportionalImage"
           style={{
             width: isNaN(this.props.width) ? this.props.width : this.props.width + 'px',
             height: isNaN(this.props.height) ? this.props.height : this.props.height + 'px'
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
               backgroundSize:this.state.sizing,
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
    console.log(src);
      this.setState({
        src: src? src:'',
      });
    this.setState({
      loading:!!src,
      loaded:false,
      error:false
    });
    console.log(this.state)
  }
  _load(){
    this._reset();
    if(!this.props.preventLoad) {
      console.log(this.state.src != this.props.src, this.state.src, this.props.src);
      if (this.state.src != this.props.src) {
        this._computeSRC(this.props.src)
      }
    }
  }
}

export default ProportionalImage;

ReactDOM.render(
  <ProportionalImage
    src="https://static.pexels.com/photos/2242/wall-sport-green-bike.jpg"
    placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA90lEQVR4Ae2XPUrGQBRFRxAEO12BVQiWrsHCZQQsXYSrsEuRHeSnsHELthZWruALIYlYiBwrxVsEnslMlXduNQMvB+6DkITYOA45DSNrmenICX8jB3IGtjKoQgUNMWiXBSMxmJYFsXCBC1zgAhdYKalSCp454ZSXVIIDFwQCl7xvF5Q8oHxx8ztRrBNoFcc8yd29zFTrBFrFGa/88MiRzOgmsAu0iowegDfOZUI38U+BVnHNJx9cyZ1swijQKiR33MpZN2EXaBW2yCYMAq3CENmEQaBVWFPs4W06p/747YhBnfYHpCdDBaqgZdpQTq2PV0H8uGAfgm/CGielQREouQAAAABJRU5ErkJggg=="
    sizing="cover"
    width="300"
    height="200"
    fade="true"
    preload="true"
    alt="bicycle"
  />,
  document.querySelector("#root")
);
