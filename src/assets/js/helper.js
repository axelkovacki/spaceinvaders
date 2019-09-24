const postToAPI = async (url, content) => {
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    });

    console.log('Success', response);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

const getToAPI = async (url) => {
  try {
    let response = await fetch(url);

    return await response.text();
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

const toUTF = (utftext) => {
  if(utftext.length > 0) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while (i < utftext.length) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }

      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }

    return string;
  }

  return utftext;
}