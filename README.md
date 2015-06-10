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
#####Copyright
2015 CPS Group
http://cpsgroup.github.io/
