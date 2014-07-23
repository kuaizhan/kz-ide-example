var template = [' ',
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta http-equiv="content-type" content="text/html; charset=UTF-8">',
    '    <script>',
    '        var staticurl = "http://s0.shaochong.com";',
    '    </script>',
    '</head>',
    '<body>',
    '',
    '</body>',
    '<script>',
    '    document.write(["<" , "script charset=\'utf-8\' src=\'", staticurl , "/res/pageui/js/ide/debugging.js\'>","</" + "script>"].join(\'\'))',
    '</script>',
    '</html>'].join('');


var http = require('http');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

var proxy_template = fs.readFileSync('./admin.html', 'utf-8');

var renderIDE = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html', 'charset': 'utf-8'});
    res.end(template);
}

var processPost = function (request, response, callback) {
    var queryData = "";
    if (typeof callback !== 'function') return null;

    if (request.method == 'POST') {
        request.on('data', function (data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function () {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

var proxy = function (req, res) {
    var request = require("request");
    var p = 'http://www.kuaizhan.com' + req.url;
    req.headers['Host'] = "www.kuaizhan.com";
    var opt = {
        method: req.method,
        url: p,
        headers: req.headers
    };
    request(opt).pipe(res);
}

var proxy_plugin = function (req, res) {
    var qureyString = require('querystring');
    var site_id = qureyString.parse(url.parse(req.url).query).site_id;
    var template = proxy_template.replace("{{site_id}}", site_id);
    var path = url.parse(req.url).pathname.split("/");
    //console.log(path);
    var proxy_type = path[2];
    var plugin_name = path[3];
    var proxy_json = require('./project/' + plugin_name + "/package.json");
    //console.log(proxy_json);
    var backend_page = proxy_json["proxy-prefixes"]["backend-page"];

    var request = require("request");
    var p = backend_page + req.url.replace('plugin/' + proxy_type + '/' + plugin_name + '/', '');
    req.headers['Host'] = url.parse(backend_page).host;
    var opt = {
        method: req.method,
        url: p,
        headers: req.headers,
        gzip: true
    };
    request(opt, function (err, response, body) {
        res.writeHead(200, {'Content-Type': 'text/html', 'charset': 'utf-8'});
        if(err){
            console.log(err);
            res.end(template.replace("{{page_content}}", JSON.stringify(err)));
        }else{
            if(response.status===200){
            res.end(template.replace("{{page_content}}", body));
            }else{
                res.end(template.replace("{{page_content}}", JSON.stringify(response)));
            }
        }


    });

}

var _handlers = {
    "readfile": function (req, res) {
        var _path = querystring.parse(url.parse(req.url).query).path;
        res.writeHead(200, {'Content-Type': 'text/text', 'charset': 'utf-8'});
        _path = path.join(__dirname, 'project', _path);
        if (fs.existsSync(_path)) {
            res.end(fs.readFileSync(_path, 'utf-8'));
        } else {
            res.end("");
        }
    },
    "project": function (req, res) {
        var p = url.parse(req.url).pathname;
        var _path = path.join(__dirname, p);
        if (fs.existsSync(_path)) {
            var extName = path.extname(_path);
            res.writeHead(200, {'Content-Type': head_ref[extName], 'charset': 'utf-8'});
            res.end(fs.readFileSync(_path, 'utf-8'));
        } else {
            res.end("");
        }
    },
    "readcomponents": function (req, res) {
        res.writeHead(200, {'Content-Type': 'application/json', 'charset': 'utf-8'});

        var plugins = fs.readdirSync(path.join(__dirname, "project/"));
        var components = {};
        plugins.forEach(function (d) {
            if (d[0] == '.') {
                return;
            }
            components[d] = [];
            if (fs.existsSync(path.join(__dirname, "project/" + d + "/components/"))) {
                console.log(fs.existsSync(path.join(__dirname, "project/" + d + "/components/")));
                fs.readdirSync(path.join(__dirname, "project/" + d + "/components/")).forEach(function (c) {

                    if (c[0] !== '.') {
                        components[d].push(c);
                    }
                });
            }
        });
        res.end(JSON.stringify(components));
    },
    "homepage": function (req, res) {
        proxy(req, res);
    },
    "nav": function (req, res) {

        proxy(req, res);
    },
    "page": function (req, res) {

        proxy(req, res);
    },
    "site": function (req, res) {
        proxy(req, res);
    },
    "plugin": function (req, res) {
        proxy_plugin(req, res);
    }

};
var head_ref = {".js": "application/x-javascript", ".json": "application/json", ".css": "text/css"};
var handleRequest = function (p, req, res) {
    p = p.toLowerCase();
    if (p in _handlers) {
        _handlers[p](req, res);
    }
    else {
        renderIDE(req, res);
    }
}

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname.split("/")[1];
    handleRequest(path, req, res);
}).listen(80, 'dev.kuaizhan.com');
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

console.log('Server running at http://dev.kuaizhan.com/');
