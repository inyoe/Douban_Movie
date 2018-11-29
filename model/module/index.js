const apikey = '0b2bdeda43b5688921839c8ecb20399b';
const start  = 1;
const count  = 10;
const city   = '深圳';

const GET_MOVIE_LIST = {
    type: 'GET',
    url: '/v2/movie/in_theaters',
    data: {
        apikey,
        start,
        count,
        city
    }
}

const GET_MOVIE_DETAIL = {
    type: 'GET',
    url: '/v2/movie/subject/:id',
    data: {
        apikey,
        city
    }
}

const GET_MOVIE_REVIEWS = {
    type: 'GET',
    url: '/v2/movie/subject/:id/reviews',
    data: {
        apikey,
        start,
        count
    }
}

const GET_MOVIE_COMMENTS = {
    type: 'GET',
    url: '/v2/movie/subject/:id/comments',
    data: {
        apikey,
        start,
        count
    }
}


module.exports = {
    GET_MOVIE_LIST,
    GET_MOVIE_DETAIL,
    GET_MOVIE_REVIEWS,
    GET_MOVIE_COMMENTS
}