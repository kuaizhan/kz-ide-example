var host = "kuaizhan";

var template = [' ',
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta http-equiv="content-type" content="text/html; charset=UTF-8">',
    '    <script>',
    '        var staticurl = "http://s0.' + host + '.com";',
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


var proxy = function (req, res) {
    var request = require("request");
    var p = 'http://www.' + host + '.com' + req.url;
    req.headers['Host'] = "www." + host + ".com";
    var opt = {
        method: req.method,
        url: p,
        headers: req.headers
    };
    if (req.method.toLowerCase() == "put" || req.method.toLowerCase() == "post") {
        req.on("data", function (chunk) {
            opt.body = chunk;

        });
        req.on("end", function () {
            request(opt).pipe(res);
        })
    } else {
        request(opt).pipe(res);
    }

}
var proxy_front = function (req, res) {

    if (url.parse(req.url).pathname.toLowerCase() === "/auth/api/authorization") {

        var auth_token = querystring.parse(url.parse(req.url).query).auth_token;
        proxy_auth(auth_token, res);
        return;
    }


    var request = require("request");
    var p = 'http://m.kuaizhan.com' + req.url;

    req.headers['host'] = "m.kuaizhan.com";
    var opt = {
        method: req.method,
        url: p,
        headers: req.headers,
        gzip: true
    };
    console.log(req.headers);
    request(opt).pipe(res);
}
var proxy_auth = function (token, res) {
    var request = require("request");
    request("http://passport.kuaizhan.com/main/api/authorization?callback=/&auth_token=" + token, function (err, response, body) {

        var data = JSON.parse(body);
        console.log(data);
        if (data.msg) {
            res.setHeader("Content-Type", "text/html");
            res.setHeader("charset", "utf-8");
            res.end(data.msg);
            return;
        }
        res.setHeader("Set-Cookie", "access_token=" + data.data.access_token + ";Domain=dev.kuaizhan.com;httponly;Path=/;");
        res.end("<html><head> <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" /></head><body>login success，<a href='/'>Back</a> <a href='/auth/api/users/me'>Test API</a></body></html>");

    })
}

var proxy_plugin = function (req, res) {

    var site_id = querystring.parse(url.parse(req.url).query).site_id;
    var template = proxy_template.replace(/\{\{site_id\}\}/ig, site_id);
    var path = url.parse(req.url).pathname.split("/");
    console.log(path);


    var plugin_name = path[2];
    var proxy_json = require('./project/' + plugin_name + "/package.json");
    //console.log(proxy_json);
    var proxy_common = proxy_json["proxy-prefixes"]["common"];
    var backend_page = proxy_json["proxy-prefixes"]["backend-page"] || proxy_common;

    var request = require("request");
    var p = backend_page + req.url.replace('pp/' + plugin_name + '/', '');
    req.headers['Host'] = url.parse(backend_page).host;
    var opt = {
        method: req.method,
        url: p,
        headers: req.headers,
        gzip: true
    };
    console.log(p);
    if (/\.(css|js|jpg|jpeg|gif|png)/ig.test(path[path.length - 1])) {
        console.log(p);
        res.writeHead(302, {'Location': req.url.replace('/pp/', '/pf/')});
        res.end();
    } else {
        request(opt, function (err, response, body) {
            res.writeHead(200, {'Content-Type': 'text/html', 'charset': 'utf-8'});
            if (err) {
                console.log(err);
                res.end(template.replace("{{page_content}}", JSON.stringify(err)));
            } else {
                if (response.statusCode == 200) {
                    res.end(template.replace("{{page_content}}", body));
                } else {
                    res.end(template.replace("{{page_content}}", JSON.stringify(response)));
                }
            }


        });
    }

}

var proxy_plugin_api = function (req, res) {

    var path = url.parse(req.url).pathname.split("/");
    //console.log(path);
    var plugin_name = path[2];
    var proxy_json = require('./project/' + plugin_name + "/package.json");
    //console.log(proxy_json);
    var proxy_common = proxy_json["proxy-prefixes"]["common"];
    var backend_api = proxy_json["proxy-prefixes"]["backend-api"] || proxy_common;


    var request = require("request");
    var p = backend_api + req.url.replace('pa/' + plugin_name + '/', '');
    console.log("proxy :" + p);
    req.headers['Host'] = url.parse(backend_api).host;
    var opt = {
        method: req.method,
        url: p,
        headers: req.headers,
        gzip: true
    };

    if (req.method.toLowerCase() == "put" || req.method.toLowerCase() == "post") {
        var data;
        req.on("data", function (chunk) {
            data = chunk;
        })
        req.on("end", function () {
            opt.body = data;
            request(opt).pipe(res);
        })
    } else {
        request(opt).pipe(res);
    }


}

var proxy_plugin_file = function (req, res) {

    var path = url.parse(req.url).pathname.split("/");
    //console.log(path);
    var plugin_name = path[2];
    var proxy_json = require('./project/' + plugin_name + "/package.json");
    //console.log(proxy_json);
    var proxy_common = proxy_json["proxy-prefixes"]["common"];
    var backend_api = proxy_json["proxy-prefixes"]["backend-page"] || proxy_common;

    var request = require("request");
    var p = backend_api + req.url.replace('pf/' + plugin_name + '/', '');
    req.headers['Host'] = url.parse(backend_api).host;

    var opt = {
        method: req.method,
        url: p,
        headers: req.headers,
        gzip: true
    };
    request(opt).pipe(res);

}

var head_ref = {".js": "application/x-javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", "gif": "image/gif", "jpg": "image/jpge", "jpge": "image/jpge", "html": "text/html"};

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
    "writefile": function (req, res) {
        res.writeHead(200, {'Content-Type': head_ref[".json"], 'charset': 'utf-8'});
        var postData;
        if (req.method === "POST") {
            req.on("data", function (data) {
                try {
                    postData = querystring.parse(String(data));
                } catch (e) {
                    console.log("获取保存数据出错", e);

                }

            });
            req.on("end", function () {
                if (postData) {
                    try {
                        var filename = postData.filename;
                        var data = postData.content;
                        var _path = path.join(__dirname, 'project/templates/', filename);
                        fs.writeFileSync(_path, data);
                        res.end(JSON.stringify({success: 1}));
                    } catch (e) {
                        res.end(JSON.stringify({error: 1, msg: e.message}));
                    }

                } else {
                    res.end(JSON.stringify({error: 1, msg: '未获取到数据'}));
                }
            })
        } else {
            res.end(JSON.stringify({error: 1, msg: '请用pst'}));
        }
    },
    "project": function (req, res) {
        var p = url.parse(req.url).pathname;
        var _path = path.join(__dirname, p);
        if (fs.existsSync(_path)) {
            var extName = path.extname(_path);
            res.writeHead(200, {'Content-Type': head_ref[extName], 'charset': 'utf-8'});
            res.end(fs.readFileSync(_path));
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

            if (fs.existsSync(path.join(__dirname, "project/" + d + "/package.json"))) {
                components[d] =components[d]|| {};
                components[d]["package.json"] = require("./project/" + d + "/package.json");
            }
            if (fs.existsSync(path.join(__dirname, "project/" + d + "/components/"))) {
                components[d] =components[d]|| {};
                fs.readdirSync(path.join(__dirname, "project/" + d + "/components/")).forEach(function (c) {

                    if (fs.existsSync(path.join(__dirname, "project/" + d + "/components/" + c + "/package.json"))) {
                        try {
                            components[d][c] = require("./project/" + d + "/components/" + c + "/package.json");
                        } catch (e) {
                            console.log(e);
                            //components[d][c] = e;
                        }
                    }
                });
            }
        });
        res.end(JSON.stringify(components));
    },
    "readthemes": function (req, res) {
        res.writeHead(200, {'Content-Type': 'application/json', 'charset': 'utf-8'});

        var plugins = fs.readdirSync(path.join(__dirname, "project/"));
        var components = {};
        plugins.forEach(function (d) {
            if (d[0] == '.') {
                return;
            }

            if (fs.existsSync(path.join(__dirname, "project/" + d + "/themes/package.json"))) {
                components[d] = require("./project/" + d + "/themes/package.json");

            }
        });
        res.end(JSON.stringify(components));
    },
    "readtemplates": function (req, res) {
        res.writeHead(200, {'Content-Type': 'application/json', 'charset': 'utf-8'});

        var plugins = fs.readdirSync(path.join(__dirname, "/project/templates/"));
        var components = {list: []};
        plugins.forEach(function (d) {
            if (d[0] == '.') {
                return;
            }


            components.list.push({file: d});
        });
        res.end(JSON.stringify(components));
    },
    "homepage": proxy,
    "passport": proxy,
    "nav": proxy,
    "page": proxy,
    "pageui": proxy,
    "pic": proxy,
    "plugin": proxy,
    "preview": proxy,
    "site": proxy,
    "changyan": proxy,
    "common": proxy,
    "auth": proxy_front,
    "pp": function (req, res) {
        proxy_plugin(req, res);
    },
    "pa": function (req, res) {
        proxy_plugin_api(req, res);
    },
    "pf": function (req, res) {
        proxy_plugin_file(req, res);
    },
    "fp": function (req, res) {
        proxy_front_plugin(req, res);
    },
    "fa": function (req, res) {
        proxy_front_plugin_api(req, res);
    },
    "ff": function (req, res) {
        proxy_front_plugin_file(req, res);
    }
};
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
}).listen(80, 'dev.' + host + '.com').listen(80, 'localhost');
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

console.log('Server running at http://dev.' + host + '.com/');
