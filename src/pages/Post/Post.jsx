import { Avatar, Divider, Loading, Tag, Text } from '@geist-ui/core';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../shared/Container/Container';
import Vote from '../../shared/Vote/Vote';
import {
  useGetPostCommentsQuery,
  useGetPostQuery,
  useLazyGetPostAuthorQuery,
  useLazyGetPostCategoriesQuery,
} from '../../store/api/apiSlice';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import Answers from './components/Answers';
import s from './Post.module.scss';

const Post = () => {
  // const { postId } = useParams();
  const postId = 3;

  const {
    data: post,
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
    isError: isPostError,
    error: postError,
  } = useGetPostQuery(postId);

  const [getPostAuthor, { data: author, isLoading: isAuthorLoading, isSuccess: isAuthorSuccess }] = useLazyGetPostAuthorQuery();
  const [getPostCategories, { data: categories, isLoading: isCategoriesLoading, isSuccess: isCategoriesSuccess }] =
    useLazyGetPostCategoriesQuery();

  useEffect(() => {
    if (post?.author_id) {
      getPostAuthor(post.author_id);
    }

    if (post?.post_categories) {
      const params = new URLSearchParams();
      post.post_categories.forEach((value) => params.append('id', value));
      getPostCategories(`?${params.toString()}`);
    }
  }, [post]);

  // if (isPostSuccess) {
  //   console.log('post', post);
  // }

  // if (isAuthorSuccess) {
  //   console.log('author', author);
  // }

  // if (isCategoriesSuccess) {
  //   console.log('categories', categories);
  // }

  if (isPostLoading) {
    return <Loading>Loading</Loading>;
  } else if (isPostError) {
    return <div>{postError.toString()}</div>;
  }
  // Ea molestias quasi exercitationem repellat qui ipsa sit aut
  return (
    <Container>
      <div className={s.post}>
        <div className={s.header}>
          <h1 className={s.title}>{capitalizeFirstLetter(post.title)}</h1>
          <div className={s.headerInfo}>
            <div className={s.author}>
              by
              {isAuthorSuccess && (
                <>
                  <Avatar src={`${process.env.REACT_APP_GET_IMG_BASEURL}${author?.profile_picture}`} ml="5px" mr="5px" />
                  <Text span type="success">
                    {author.login}
                  </Text>
                </>
              )}
            </div>

            <div className={s.date} title={post.publish_date}>
              {moment(post.publish_date).fromNow()}
            </div>
          </div>
          <Divider />
        </div>

        <div className={s.content}>
          <div className={s.contentText}>
            <p>
              {capitalizeFirstLetter(post.content)} {capitalizeFirstLetter(post.content)}
            </p>
            {/* <p>
              {capitalizeFirstLetter(post.content)} {capitalizeFirstLetter(post.content)} {capitalizeFirstLetter(post.content)}
            </p> */}
          </div>

          <div className={s.contentFooter}>
            <div className={s.categories}>
              {isCategoriesSuccess &&
                categories.map((item) => (
                  <Tag key={item.id} type="lite" mr="10px">
                    {item.title}
                  </Tag>
                ))}
            </div>
            {/* <div></div> */}
            <Vote postId={post.id} voteCount={post.rating} />
          </div>
        </div>

        <Answers postId={postId}/>
      </div>
    </Container>
  );
};

export default Post;
