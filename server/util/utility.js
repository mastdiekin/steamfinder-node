const chalk = require("chalk");
const sanitize = require("sanitize-html");

module.exports = {
  colenv: (type) => {
    return console.info(
      `Current environment${type !== undefined ? " " + type : ""}`,
      process.env.NODE_ENV === "production"
        ? chalk.white.bgGreen(" " + process.env.NODE_ENV + " ")
        : chalk.black.bgRed(" " + process.env.NODE_ENV + " ")
    );
  },

  /**
   * Sanitize (https://www.npmjs.com/package/sanitize)
   * @param str {String} Строка для очистки
   * @param tags {Array} Одобренные теги ['a']
   * @param attributes {Object} Одобренные аттрибуты {a: ["href"]}
   */
  sanitize: (str, tags, attributes) => {
    return sanitize(str, {
      allowedTags: tags,
      allowedAttributes: attributes,
    });
  },

  /**
   * Возвращает эрор страницу с указанными даными
   * @param req {Object} Request
   * @param res {Object} Response
   * @param message {String} Сообщение об ошибке
   * @param title {String} Заголовок ошибки
   */
  error: (req, res, message, title) => {
    return res.render("404", {
      title: title || "404",
      name: title || "404",
      message: message || "Page not found",
      libs: [],
      scripts: [],
    });
  },

  /**
   * Делает из указанных параметров, query строку (?test=5&asd=test)
   * @param {Object} params {test: 5, asd: 'test'}
   */
  fetchParams(params) {
    if (!params) return "";
    const array = Object.keys(params)
      .filter((key) => params[key] !== undefined)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      );
    return `${array.join("&")}`;
  },

  /**
   * См. this.fetchParams, прибавляет к ней указанный url. (http://google.ru?test=5&asd=test)
   * @param {String} baseUrl Url
   * @param {Object} queryParams {test: 5, asd: 'test'}
   */
  constructEndpoint(baseUrl, queryParams) {
    const paramsString = this.fetchParams(queryParams);
    return paramsString ? `${baseUrl}?${paramsString}` : baseUrl;
  },

  /**
   * Получаем объект из query params строки
   * @param {String} search query params строка
   */
  getUrlParams(search) {
    let params = {};
    new URLSearchParams(search).forEach((d, e) => {
      let a = decodeURIComponent(e),
        c = decodeURIComponent(d);
      if (a.endsWith("[]")) {
        (a = a.replace("[]", "")),
          params[a] || (params[a] = []),
          params[a].push(c);
      } else {
        let b = a.match(/\[([a-z0-9_\/\s,.-])+\]$/g);
        b
          ? ((a = a.replace(b, "")),
            (b = b[0].replace("[", "").replace("]", "")),
            params[a] || (params[a] = []),
            (params[a][b] = c))
          : (params[a] = c);
      }
    });
    return params;
  },

  /**
   * Получаем объект из query params строки. v2.
   * @param {String} search query params строка
   */
  getUrlParams2(search) {
    const hashes = search.slice(search.indexOf("?") + 1).split("&");
    const params = {};
    hashes.map((hash) => {
      let [key, val] = hash.split("=");
      key = decodeURIComponent(key);
      if (key.indexOf("[") > -1) {
        // handle multiple type inputs
        if (typeof params[key] === "undefined") {
          params[key] = [];
        }

        params[key].push(decodeURIComponent(val));
      } else {
        params[key] = decodeURIComponent(val);
      }
    });
    return params;
  },
};
