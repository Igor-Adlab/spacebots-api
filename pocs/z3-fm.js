const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');

const agent = new SocksProxyAgent("socks5://13.234.24.116:1080");

async function main() {
    const { data } = await axios.get('https://z3.fm/mp3/search?keywords=LP', {
        headers: {
            Cookie: 'zvApp=detect2; zvAuth=1; zvLang=0; _ga=GA1.1.306192336.1729008176; PHPSESSID=akf4mbj9jfrrjchuqmnfki0rh0; YII_CSRF_TOKEN=cfff713d42084f840ae1b0788e76c0eba6b11955; zv=tak-tak-tak; ZvcurrentVolume=100; z1_n=2; _ga_4QVWK2LSTX=GS1.1.1730944772.6.1.1730944787.0.0.0'
        },
        maxRedirects: 10,
        httpAgent: agent,
    });

    console.log(data);
}

main()