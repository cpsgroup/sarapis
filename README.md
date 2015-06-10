# sarapis [![Build Status](https://api.shippable.com/projects/5576aac7edd7f2c0520dec32/badge?branchName=master)](https://app.shippable.com/projects/5576aac7edd7f2c0520dec32/builds/latest)
A RESTful, proxied, read-only Solr interface

---------------------------
#####API documentation
######Static
http://sarapis.herokuapp.com

Generated with https://www.npmjs.com/package/bootprint-swagger:

bootprint swagger http://localhost:3000/swagger/swagger static

######Dynamic
http://sarapis.herokuapp.com/docs

Generated with https://www.npmjs.com/package/hapi-swaggered

---------------------------
#####Docker image
An io.js-based image is built automatically, available here:
https://registry.hub.docker.com/u/cpsgroup/sarapis/

---------------------------
#####Usage
sarapis.js --solr-host [string] --solr-port [num]

######Options:
  --solr-host     The host address of a Solr instance to connect to.  [required]
  
  --solr-port     The port of a Solr instance to connect to.          [required]
  
  --solr-core     A core of a Solr instance to connect to.
  
  --solr-allow    The methods to be allowed on the Solr instance(s).
  
  --solr-deny     The parameters to be prohibited on the Solr instance(s).
  
  --proxy-port    The port of the Solr proxy.
  
  --proxy-path    The valid paths for the Solr proxy.
  
  --sarapis-port  The port of this Sarapis server instance.
  
  --version       Show version number                                  [boolean]

---------------------------
#####License
The MIT License (MIT)

Copyright (c) 2015 CPS Group http://cpsgroup.github.io/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
