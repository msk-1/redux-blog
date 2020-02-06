import jsonPlaceholder from "../apis/jsonPlaceholder";
import _ from 'lodash';

export const fetchPostsAndUseers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());

  const userIds = _.uniq(_.map(getState().posts, 'userId'));
  userIds.forEach(id => dispatch(fetchUser(id)));

  _.chan(getState().posts)
    .map('userId')
    .uniq()
    .forEach(id => dispatch(fetchUser(id)))
    .value();
}

export const fetchPosts = () => async dispatch => {
  const response = await jsonPlaceholder.get('/posts');

  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = function(id) {
  return _.memoize(async function(dispatch) {
    const response = await jsonPlaceholder.get(`/users/${id}`);

    dispatch({ type: 'FETCH_USER', payload: response.data });
  });
};
