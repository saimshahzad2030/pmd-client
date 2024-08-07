import config from "./config"
// export const sdk = {
  
//     "type": "service_account",
//     "project_id": "precious-metal-market",
//     "private_key_id": "ac16f72a62147d1804183253cb26b48032f31fcd",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDJNp8tBGL+wVHV\nf1Y/nSh1KaM7JliCyZyv5vaLLUx9vmMMs/Q4siCXIoI9ESVeKCs6cXidrvaqeRpW\nf30+x7XK1AdU4Ycwo1PUkbDXvK57U41YMtQjXSBT4FEGU3yxEakH5DsH+m0dhxtt\n+WS8JusjZtvkl/b+kLwN/IawbC+bP0SXaQ7lt4KmXHTjm23AdXrkkAAn0O6UWDy6\n/I4YmC8kxC3Kp1aNMSyuRfnpckPK1Dtt0/l5W/5vBHP1UJoTQp5uahzKgQYKV4Pp\nbJCwqoMQi8SEmJOdLZq9MsmfC95P3lju870WM5WLtAoQYUvv44/Il57w29SlUsc3\ng59ZupQpAgMBAAECggEABBl6DEGA39Zh+7LUt8aUrrBqvDeHiaCgceAHiWXin1Q7\n8eQPt4D/k3y3QRXCmGTCnrX1ombQbUA65mTCET+h51BDFvpiVf4Z5OSUAQ0909Lr\nuA6PDmplEHhrRjD4wyXMNxYyErNKOlYIm8i/QescEtRTahijhmO+BR3uQ5VsseHC\nlwg7kk3SW9a7MSp4gS3yLxEmHT/e+ujBRmv2UKd9OhuZc0UjBbeYk23GmLEhZskN\nrdyn5YM1kMwysSG910AcbqzcM5eEu+1sv5IT+UpnpmfUfPPqCGmaW/sqn/7dO8e6\nb8/vDYjea4fNbGCpE9bTx2Lpg8Oq/slprm7O2nWclQKBgQDz7iaNFSj5Qhfufzda\nhomsjbWmUT12xciWow3gtCZmRgZObZPJ7W1Dx+NbimF/xZJZVjMA0AHk9Mz5d5Pg\nDF0ieli60uuGJp1FzQmKYjCh7GEZ0EPcedsF2i0opTsqmnfbN3ihVNGOOX7kSs4U\nylwcFMlXjO++O5yaJaxx7wb2bQKBgQDTK2D4rUCFhsLFAohHQClgMOxvI5qpXKG7\nPsJLr7vcaEoPUdgCwRpF+jWO/d2a9bA6NLTot1Pafp+uxMiqsMYBoFL53ranQFkN\ndjHvRuDYyifoPd0tj57ugHh/0wqCyouYmSpSi/RrOpU115TCAMjCaYYdFM0Gv4ai\nb0KhykhvLQKBgB+bgEtPrpt9wPQab+W/AR/mzN7cMAav4ioCvs2bCk6+TBrlf/zu\nUvYxdHhsGe4gf7IrxTgZu+UbA2Rf5j1l3LuW9uBebD5Zyo883jucNYkFxB9AKUrs\nT0EW4DsgDeabVWSGb48YGn8/W/3g44s2HXFWEDDUBky0FLq0nv+0ZUaRAoGAYfTQ\ncerkcExYE02ea/beeqmXM+L/PqsitxpgxP1LFu4l1L9xha2QA4AS0jb/Un+/9PA4\nL2/DbSqp5keQkmWYJG77rr9aWXFnHfCDL2zgpo/4PSpdbGIgJqDfxOPgD1Xntazv\nTgVwJ0Gwr55Gekwk1NJgjSL2DLhRuw4DicutGC0CgYAGnbWfs00xzqRFk9bJkeru\n8cTQumfshvP8TmgEY2Je6Hd/a8umxCU0mxUbauP0VT12gSUSehHSePfJY2n8I9f2\nJap44FpZHR2F0/gA2rGDPXPD5/7R+ueqjgT1WM3PWTrcABeMLXIHSIoO+7OYNQTF\njV/qV5owvY33urdhQJ8q9w==\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-n2mk6@precious-metal-market.iam.gserviceaccount.com",
//     "client_id": "103169748350662528597",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n2mk6%40precious-metal-market.iam.gserviceaccount.com",
//     "universe_domain": "googleapis.com"
  
  
// }
// import config from "./config"
export const sdk = {
  
    "type": config.TYPE,
    "project_id": config.PROJECT_ID,
    "private_key_id":config.PRIVATE_KEY_ID,
      "private_key": `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDJNp8tBGL+wVHV\nf1Y/nSh1KaM7JliCyZyv5vaLLUx9vmMMs/Q4siCXIoI9ESVeKCs6cXidrvaqeRpW\nf30+x7XK1AdU4Ycwo1PUkbDXvK57U41YMtQjXSBT4FEGU3yxEakH5DsH+m0dhxtt\n+WS8JusjZtvkl/b+kLwN/IawbC+bP0SXaQ7lt4KmXHTjm23AdXrkkAAn0O6UWDy6\n/I4YmC8kxC3Kp1aNMSyuRfnpckPK1Dtt0/l5W/5vBHP1UJoTQp5uahzKgQYKV4Pp\nbJCwqoMQi8SEmJOdLZq9MsmfC95P3lju870WM5WLtAoQYUvv44/Il57w29SlUsc3\ng59ZupQpAgMBAAECggEABBl6DEGA39Zh+7LUt8aUrrBqvDeHiaCgceAHiWXin1Q7\n8eQPt4D/k3y3QRXCmGTCnrX1ombQbUA65mTCET+h51BDFvpiVf4Z5OSUAQ0909Lr\nuA6PDmplEHhrRjD4wyXMNxYyErNKOlYIm8i/QescEtRTahijhmO+BR3uQ5VsseHC\nlwg7kk3SW9a7MSp4gS3yLxEmHT/e+ujBRmv2UKd9OhuZc0UjBbeYk23GmLEhZskN\nrdyn5YM1kMwysSG910AcbqzcM5eEu+1sv5IT+UpnpmfUfPPqCGmaW/sqn/7dO8e6\nb8/vDYjea4fNbGCpE9bTx2Lpg8Oq/slprm7O2nWclQKBgQDz7iaNFSj5Qhfufzda\nhomsjbWmUT12xciWow3gtCZmRgZObZPJ7W1Dx+NbimF/xZJZVjMA0AHk9Mz5d5Pg\nDF0ieli60uuGJp1FzQmKYjCh7GEZ0EPcedsF2i0opTsqmnfbN3ihVNGOOX7kSs4U\nylwcFMlXjO++O5yaJaxx7wb2bQKBgQDTK2D4rUCFhsLFAohHQClgMOxvI5qpXKG7\nPsJLr7vcaEoPUdgCwRpF+jWO/d2a9bA6NLTot1Pafp+uxMiqsMYBoFL53ranQFkN\ndjHvRuDYyifoPd0tj57ugHh/0wqCyouYmSpSi/RrOpU115TCAMjCaYYdFM0Gv4ai\nb0KhykhvLQKBgB+bgEtPrpt9wPQab+W/AR/mzN7cMAav4ioCvs2bCk6+TBrlf/zu\nUvYxdHhsGe4gf7IrxTgZu+UbA2Rf5j1l3LuW9uBebD5Zyo883jucNYkFxB9AKUrs\nT0EW4DsgDeabVWSGb48YGn8/W/3g44s2HXFWEDDUBky0FLq0nv+0ZUaRAoGAYfTQ\ncerkcExYE02ea/beeqmXM+L/PqsitxpgxP1LFu4l1L9xha2QA4AS0jb/Un+/9PA4\nL2/DbSqp5keQkmWYJG77rr9aWXFnHfCDL2zgpo/4PSpdbGIgJqDfxOPgD1Xntazv\nTgVwJ0Gwr55Gekwk1NJgjSL2DLhRuw4DicutGC0CgYAGnbWfs00xzqRFk9bJkeru\n8cTQumfshvP8TmgEY2Je6Hd/a8umxCU0mxUbauP0VT12gSUSehHSePfJY2n8I9f2\nJap44FpZHR2F0/gA2rGDPXPD5/7R+ueqjgT1WM3PWTrcABeMLXIHSIoO+7OYNQTF\njV/qV5owvY33urdhQJ8q9w==\n-----END PRIVATE KEY-----\n`,

    "client_email":config.CLIENT_EMAIL,
    "client_id": config.CLIENT_ID,
    "auth_uri": config.AUTH_URI,
    "token_uri": config.TOKEN_URI,
    "auth_provider_x509_cert_url": config.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": config.CLIENT_X509_CCERT_URL,
    "universe_domain":config.UNIVERSE_DOMAIN
  
  
}