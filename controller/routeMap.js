module.exports = [
    {
        name: 'index',
        url: '/',
        method: 'get',
        handler: ['common', 'index']
    },
    {
        name: 'movieList',
        url: '/list',
        method: 'get',
        handler: ['common', 'movieList']
    },
    {
        name: 'movieDetail',
        url: '/detail/:id',
        method: 'get',
        handler: ['common', 'movieDetail']
    },
    {
        name: 'apiReviews',
        url: '/_api/reviews/',
        method: 'get',
        handler: 'apiReviews'
    },
    {
        name: 'apiImageUpload',
        url: '/_api/upload/',
        method: 'post',
        handler: 'apiImageUpload'
    }
]