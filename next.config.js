/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ["yt3.googleusercontent.com", "i.ytimg.com"],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                tls: false,
                net: false,
                dns: false,
                child_process: false,
            };
        }

        return config;
    },
};
