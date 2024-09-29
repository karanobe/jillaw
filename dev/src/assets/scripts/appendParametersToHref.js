const param_obj = urlParametersToObj();

(document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', initPassParams()) : initPassParams()

function initPassParams() {
    document.querySelectorAll('body [href]').forEach(link => _changeHref(link));
}

function urlParametersToObj() {

    const url    = new URL(window.location);
    // Removes `?`
    const url_parameter_no_mark = url.search.slice(1);

    const params = new URLSearchParams(url_parameter_no_mark);


    let param_obj = {};
    for(let value of params.keys()) {
        param_obj[value] = params.get(value);
    }

    return param_obj;

}

function _changeHref(link) {

    const q = new URL(link.href);

    // Stop href modifications if hash is found
    if(q.hash !== '' || q.protocol !== 'https:') {
        return;
    }

    let new_query = _appendQuery(link.href, param_obj);

    link.href = (new_query) ? `${q.origin}${q.pathname}?${new_query}` : `${q.origin}${q.pathname}`;

}

function _appendQuery(link, param_obj) {

    if(!link) {
        throw new Error('link was expected.');
    }

    if(!param_obj) {
        throw new Error('param_obj was expected.');
    }

    if(typeof param_obj !== 'object') {
        throw new Error('param_obj should be an object.');
    }

    let url                   = new URL(link);
    let url_parameter_no_mark = url.search.slice(1);
    let params                = new URLSearchParams(url_parameter_no_mark);



    for(const key in param_obj) {
        // Appends a specified key/value pair as a new search parameter.
        params.append(key,param_obj[key]);
    }

    return params.toString();

}