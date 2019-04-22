module.exports = function (app, nus) {
  var opts = app.get('opts')
    , http = require('http')
    , router = require('express').Router();

  router.route('/shorten')
    .post(function (req, res) {
      nus.shorten(req.body['long_url'], req.body['start_date'], req.body['end_date'], req.body['c_new'], req.body['metadata'], function (err, reply) {
        if (err) {
          jsonResponse(res, err);
        } else if (reply) {
          reply.short_url = opts.url.replace(/\/$/, '') + '/' + reply.hash;
          jsonResponse(res, 200, reply);
        } else {
          jsonResponse(res, 500);
        }
      });
    });

  router.route('/expand')
    .post(function (req, res) {
      nus.expand(req.body['short_url'], function (err, reply) {
        if (err) {
          jsonResponse(res, err);
        } else if (reply) {
          jsonResponse(res, 200, reply);
        } else {
          jsonResponse(res, 500);
        }
      });
    });

  router.route('/expand/:short_url')
    .get(function (req, res) {
      nus.expand(req.params.short_url, function (err, reply) {
        if (err) {
          jsonResponse(res, err);
        } else if (reply) {
          startDate = parseInt(reply.start_date) || 0;
          endDate = parseInt(reply.end_date) || 0;
          toDay = new Date();

          if ((parseInt(startDate) > 0) && (parseInt(endDate) > 0)) {
            if((+startDate - +toDay) > 0 || (+endDate - +toDay) < 0 ){
              err = {"error" : "URL Expired"};
              jsonResponse(res, 400, err);
              return;
            }
          }
          jsonResponse(res, 200, reply);

        } else {
          jsonResponse(res, 500);
        }
      });
    });

  function jsonResponse (res, code, data) {
    data = data || {};
    data.status_code = (http.STATUS_CODES[code]) ? code : 503,
    data.status_txt = http.STATUS_CODES[code] || http.STATUS_CODES[503]

    res.status(data.status_code).json(data)
  }

  return router;
};
