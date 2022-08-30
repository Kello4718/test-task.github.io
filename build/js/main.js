"use strict";

// Переменные
const postsSearch = document.querySelector('.posts__search');
const postsList = document.querySelector('.posts__list');
const buttonPrev = document.querySelector('.posts__button-prev');
const buttonNext = document.querySelector('.posts__button-next');
const form = document.querySelector('.add-post__form');
const formTitle = document.querySelector('.add-post__form-title-input');
const formDescription = document.querySelector('.add-post__form-description-textarea');
let count = 1; // Функция, которая создает элемент

const makeElement = (tagName, className, textContent = '') => {
  const element = document.createElement(tagName);
  element.classList.add(className);
  element.textContent = textContent;
  return element;
}; // Функция, которая отрисовывает пост в списке постов


const printPost = ({
  id,
  title,
  body
}) => {
  const li = makeElement('li', 'posts__item');
  li.appendChild(makeElement('span', 'posts__item-id', id));
  li.appendChild(makeElement('h3', 'posts__item-title', title));
  li.appendChild(makeElement('p', 'posts__item-description', body));
  li.appendChild(makeElement('button', 'posts__item-button-delete'));
  return li;
}; // Функция, которая находит все посты на странице и позволяет удалять их по нажатию на крестик


const deletePost = () => {
  const buttonsDelete = document.querySelectorAll('.posts__item-button-delete');

  for (const buttonDelete of buttonsDelete) {
    buttonDelete.addEventListener('click', () => {
      const parent = buttonDelete.parentElement;
      parent.remove();
    });
  }
}; // Функция, которая получает посты с сервера


const getPosts = async () => {
  const fetchPost = await fetch('https://jsonplaceholder.typicode.com/posts');
  const responsePost = await fetchPost.json();
  buttonPrev.classList.add('disabled');
  const arrayOfPosts = responsePost.map(item => item);
  arrayOfPosts.slice(0, count * 10).forEach(item => {
    const post = printPost(item);
    postsList.appendChild(post);
  });
  deletePost();
  buttonPrev.addEventListener('click', () => {
    if (count > 1) {
      postsList.innerHTML = '';
      count--;
      count === 1 ? buttonPrev.classList.add('disabled') : buttonPrev.classList.remove('disabled');
      const start = (count - 1) * 10;
      const end = count * 10;
      const quantityOfPosts = arrayOfPosts.slice(start, end);
      const quantityOfPostsOnNextPage = arrayOfPosts.slice(count * 10, (count + 1) * 10);
      quantityOfPosts <= 10 || quantityOfPostsOnNextPage <= 1 ? buttonNext.classList.add('disabled') : buttonNext.classList.remove('disabled');
      arrayOfPosts.slice(start, end).map(item => {
        const post = printPost(item);
        postsList.appendChild(post);
      });
      deletePost();
    }
  });
  buttonNext.addEventListener('click', () => {
    postsList.innerHTML = '';
    count++;
    count > 1 ? buttonPrev.classList.remove('disabled') : buttonPrev.classList.add('disabled');
    const start = (count - 1) * 10;
    const end = count * 10;
    const quantityOfPosts = arrayOfPosts.slice(start, end);
    const quantityOfPostsOnNextPage = arrayOfPosts.slice(count * 10, (count + 1) * 10);
    quantityOfPosts <= 10 || quantityOfPostsOnNextPage <= 1 ? buttonNext.classList.add('disabled') : buttonNext.classList.remove('disabled');
    arrayOfPosts.slice(start, end).map(item => {
      const post = printPost(item);
      postsList.appendChild(post);
    });
    deletePost();
  });
  form.addEventListener('submit', evt => {
    evt.preventDefault();
    const newPost = {
      id: arrayOfPosts.length,
      title: formTitle.value,
      body: formDescription.value
    };
    arrayOfPosts.push(newPost);
    const start = (count - 1) * 10;
    const end = count * 10;
    const quantityOfPosts = arrayOfPosts.slice(start, end);
    const quantityOfPostsOnNextPage = arrayOfPosts.slice(count * 10, (count + 1) * 10);
    quantityOfPosts <= 10 || quantityOfPostsOnNextPage <= 1 ? buttonNext.classList.add('disabled') : buttonNext.classList.remove('disabled');
    formTitle.value = '';
    formDescription.value = '';
    postsList.innerHTML = '';
    arrayOfPosts.slice(start, end).map(item => {
      const post = printPost(item);
      postsList.appendChild(post);
    });
    deletePost();
  });
  postsSearch.addEventListener('input', () => {
    postsList.innerHTML = '';
    arrayOfPosts.filter(item => {
      if (item.title.includes(postsSearch.value)) {
        const post = printPost(item);
        postsList.appendChild(post);
      }
    });
  });
};

getPosts();