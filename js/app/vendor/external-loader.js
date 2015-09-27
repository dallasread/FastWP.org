function externalLoader(url, callback) {
    var script = null;

    if (url.indexOf('js') !== -1) {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
    } else {
        script = document.createElement( 'link' );
        script.setAttribute( 'href', url );
        script.setAttribute( 'rel', 'stylesheet' );
        script.setAttribute( 'type', 'text/css' );
    }

    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };
    } else {
        script.onload = function() {
            if (typeof callback === 'function') {
                callback();
            }
        };
    }

    document.getElementsByTagName('head')[0].appendChild(script);
}

if (typeof module !== 'undefined') {
    module.exports = externalLoader;
} else {
    window.externalLoader = externalLoader;
}
