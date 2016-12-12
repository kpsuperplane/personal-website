/**	jQuery.browser
 *	@author	J.D. McKinstry (2014)
 *	@description	Made to replicate older jQuery.browser command in jQuery versions 1.9+
 *	@see http://jsfiddle.net/SpYk3/wsqfbe4s/
 *
 *	@extends	jQuery
 *	@namespace	jQuery.browser
 *	@example	jQuery.browser.browser == 'browserNameInLowerCase'
 *	@example	jQuery.browser.version
 *	@example	jQuery.browser.mobile	@returns	BOOLEAN
 *	@example	jQuery.browser['browserNameInLowerCase']
 *	@example	jQuery.browser.chrome	@returns	BOOLEAN
 *	@example	jQuery.browser.safari	@returns	BOOLEAN
 *	@example	jQuery.browser.opera	@returns	BOOLEAN
 *	@example	jQuery.browser.msie	@returns	BOOLEAN
 *	@example	jQuery.browser.mozilla	@returns	BOOLEAN
 *	@example	jQuery.browser.webkit	@returns	BOOLEAN
 *	@example	jQuery.browser.ua	@returns	navigator.userAgent String
 */
;;(function($){var a=$.fn.jquery.split("."),b;for(b in a)a[b]=parseInt(a[b]);if(!$.browser&&(1<a[0]||9<=a[1])){a={browser:void 0,version:void 0,mobile:!1};navigator&&navigator.userAgent&&(a.ua=navigator.userAgent,a.webkit=/WebKit/i.test(a.ua),a.browserArray="MSIE Chrome Opera Kindle Silk BlackBerry PlayBook Android Safari Mozilla Nokia".split(" "),/Sony[^ ]*/i.test(a.ua)?a.mobile="Sony":/RIM Tablet/i.test(a.ua)?a.mobile="RIM Tablet":/BlackBerry/i.test(a.ua)?a.mobile="BlackBerry":/iPhone/i.test(a.ua)?
a.mobile="iPhone":/iPad/i.test(a.ua)?a.mobile="iPad":/iPod/i.test(a.ua)?a.mobile="iPod":/Opera Mini/i.test(a.ua)?a.mobile="Opera Mini":/IEMobile/i.test(a.ua)?a.mobile="IEMobile":/BB[0-9]{1,}; Touch/i.test(a.ua)?a.mobile="BlackBerry":/Nokia/i.test(a.ua)?a.mobile="Nokia":/Android/i.test(a.ua)&&(a.mobile="Android"),/MSIE|Trident/i.test(a.ua)?(a.browser="MSIE",a.version=/MSIE/i.test(navigator.userAgent)&&0<parseFloat(a.ua.split("MSIE")[1].match(/[0-9\.]{1,}/)[0])?parseFloat(a.ua.split("MSIE")[1].match(/[0-9\.]{1,}/)[0]):
"Edge",/Trident/i.test(a.ua)&&/rv:([0-9]{1,}[\.0-9]{0,})/.test(a.ua)&&(a.version=parseFloat(a.ua.match(/rv:([0-9]{1,}[\.0-9]{0,})/)[1].match(/[0-9\.]{1,}/)[0]))):/Chrome/.test(a.ua)?(a.browser="Chrome",a.version=parseFloat(a.ua.split("Chrome/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Opera/.test(a.ua)?(a.browser="Opera",a.version=parseFloat(a.ua.split("Version/")[1].match(/[0-9\.]{1,}/)[0])):/Kindle|Silk|KFTT|KFOT|KFJWA|KFJWI|KFSOWI|KFTHWA|KFTHWI|KFAPWA|KFAPWI/i.test(a.ua)?(a.mobile="Kindle",
/Silk/i.test(a.ua)?(a.browser="Silk",a.version=parseFloat(a.ua.split("Silk/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Kindle/i.test(a.ua)&&/Version/i.test(a.ua)&&(a.browser="Kindle",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0]))):/BlackBerry/.test(a.ua)?(a.browser="BlackBerry",a.version=parseFloat(a.ua.split("/")[1].match(/[0-9\.]{1,}/)[0])):/PlayBook/.test(a.ua)?(a.browser="PlayBook",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):
/BB[0-9]{1,}; Touch/.test(a.ua)?(a.browser="Blackberry",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Android/.test(a.ua)?(a.browser="Android",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Safari/.test(a.ua)?(a.browser="Safari",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Firefox/.test(a.ua)?(a.browser="Mozilla",a.version=parseFloat(a.ua.split("Firefox/")[1].match(/[0-9\.]{1,}/)[0])):
/Nokia/.test(a.ua)&&(a.browser="Nokia",a.version=parseFloat(a.ua.split("Browser")[1].match(/[0-9\.]{1,}/)[0])));if(a.browser)for(var c in a.browserArray)a[a.browserArray[c].toLowerCase()]=a.browser==a.browserArray[c];$.extend(!0,$.browser={},a)}})(jQuery);
/* - - - - - - - - - - - - - - - - - - - */
