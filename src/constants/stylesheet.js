import className from './class-name'

const code = `
.${className.enabled} *:not(#animated-yoodle) {
  background-image: none!important;
}
.${className.enabled} video,
.${className.enabled} img {
  display: none!important;
}
.${className.enabled} ytd-topbar-logo-renderer ytd-yoodle-renderer img,
.${className.enabled} ytd-topbar-menu-button-renderer yt-img-shadow img,
.${className.enabled} #links-holder yt-img-shadow img {
  display: inherit!important;
}
.${className.enabled} .html5-video-player {
  background-color: #000;
}
`

export default code
