/**
 * Created by weimeng on 16/5/24.
 * © 2016 NCF GROUP ALL RIGHTS RESERVED
 */
export function parse_url(url) {
  var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
  var matches = url.match(pattern);

  var dats = {
    scheme: matches[2],
    authority: matches[4],
    path: matches[5],
    query: matches[7],
    fragment: matches[9]
  };
  return dats;

}