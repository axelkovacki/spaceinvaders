// Scan VCard

const vParse = input => {
  var Re1 = /^(fn|title|org|tel|email|url|adr|home\s?):(.+)$/i;
  var Re2 = /^([^:;]+);([^:]+):(.+)$/;
  var ReKey = /item\d{1,2}\./;
  var fields = {};

  input.split(/\r\n|\r|\n/).forEach(function (line) {
    var results, key;

    if (Re1.test(line)) {
      results = line.match(Re1);
      key = results[1].toLowerCase();
      fields[key] = results[2];
    } else if (Re2.test(line)) {
      results = line.match(Re2);
      key = results[1].replace(ReKey, "").toLowerCase();

      var meta = {};
      results[2]
        .split(";")
        .map(function (p, i) {
          var match = p.match(/([a-z]+)=(.*)/i);
          if (match) {
            return [match[1], match[2]];
          } else {
            return ["TYPE" + (i === 0 ? "" : i), p];
          }
        })
        .forEach(function (p) {
          meta[p[0]] = p[1];
        });

      if (!fields[key]) fields[key] = [];

      fields[key].push({
        meta: meta,
        value: results[3].split(";")
      });
    }
  });
  fields.address = null;
  if (fields.adr[0].value.length > 0) {
    var filtered = fields.adr[0].value.filter(function (el) {
      return el != "";
    });
    fields.address = filtered.join(" - ");
  }
  return fields;
}

let scanner = new Instascan.Scanner({ video: document.getElementById('webcam') });
scanner.addListener('scan', function (content) {
  content = vParse(content);
  content.title = toUTF(content.title);
  content.fn = toUTF(content.fn);
  content.org = toUTF(content.org);
  content.timestamp = Date.now();
  content.score = 0;

  // Set current player
  currentPlayer = {
    name: content.fn,
    score: content.score,
    timestamp: content.timestamp
  }

  postToAPI('/create-user', content);

  if(hasGameStarted === false) {
    initGame();
    hasGameStarted = true;
  }
});
Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length > 0) {
    scanner.start(cameras[0]);
  } else {
    console.error('No cameras found.');
  }
}).catch(function (e) {
  console.error(e);
});
