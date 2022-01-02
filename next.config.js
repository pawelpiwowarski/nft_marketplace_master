module.exports = {
  
  
    webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false, 
        http: false, 
        https: false, 
        os: false, 
        stream: false, 
        tty:false, 
        zlib: false,
        crypto: false
    ,querystring: false };
  
      return config;
    },
  };