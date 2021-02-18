module.exports = {
    async rewrites() {
        return [
            {
                source: `/.password`,
                destination: '/',
            },
            {
                source: `/:folder*/.password`,
                destination: '/',
            }
        ];
    },
}