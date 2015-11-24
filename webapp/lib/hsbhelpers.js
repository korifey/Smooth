/**
 * Created by kascode on 02.09.15.
 */
var l = require('../public/javascripts/locale');

// Handlebars Localisation Helper
// Source: https://gist.github.com/tracend/3261055
exports.localize = function (keyword) {
  var lang = global.sess.lang;

  // pick the right dictionary (if only one available assume it's the right one...)
  var locale = l[lang] || l['ru-RU'] || false;

  // exit now if there's no data
  if( !locale ) return target;

  // loop through all the key hierarchy (if any)
  var target = locale;
  var key = keyword.split(".");
  for (i in key){
    target = target[key[i]];

  }
  // fallback to the original string if nothing found
  target = target || keyword;
  //output
  return target;
};