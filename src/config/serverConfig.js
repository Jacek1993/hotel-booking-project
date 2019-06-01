const rootDirectory=process.cwd();
//todo trzeba tutaj dodac chyba wszyskie url wystepujace w serwerze zeby to pozniej jakos ogarnac
export const config={
    uploadedFilePath: `${rootDirectory}/src/img`,
    privateKeyFilePath: `${rootDirectory}/src/server/config/private.key`,
    publicKeyFilePath: `${rootDirectory}/src/server/config/public.key`,
    port: process.env.PORT || 3000
}

console.log(config.uploadedFilePath);